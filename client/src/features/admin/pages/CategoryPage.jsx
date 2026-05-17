import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CategoryForm from "../components/CategoryForm";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  const [editing, setEditing] = useState(null);

  const [reassignCtx, setReassignCtx] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");

  // LOAD CATEGORIES
  const load = async () => {
    const res = await getCategories();

    setCategories(res.data || []);
  };

  useEffect(() => {
    load().catch(() => toast.error("Failed to load categories"));
  }, []);

  // DELETE CATEGORY
  const requestDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);

      toast.success("Category deleted");

      load();
    } catch (err) {
      if (err?.response?.data?.code !== "CATEGORY_REASSIGN_REQUIRED") {
        toast.error(err?.response?.data?.message || "Delete failed");

        return;
      }

      const meta = err.response.data.meta || {};

      setReassignCtx({
        categoryId,

        options: meta.suggestedCategories || [],

        selected: meta.suggestedCategories?.[0]?.id || "",
      });
    }
  };

  // CONFIRM REASSIGN DELETE
  const confirmReassignDelete = async () => {
    await deleteCategory(reassignCtx.categoryId, {
      reassignedCategoryId: reassignCtx.selected,
    });

    toast.success("Category deleted and products reassigned");

    setReassignCtx(null);

    load();
  };

  // QUICK CREATE CATEGORY
  const quickCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await createCategory({
      name: newCategoryName.trim(),
      slug,
    });

    toast.success("New category created");

    setNewCategoryName("");

    load();
  };

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* CREATE FORM */}
        <div className="bg-white border rounded-xl p-4">
          <CategoryForm onSuccess={load} />
        </div>

        {/* CATEGORY LIST */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3">Categories</h2>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{category.name}</p>

                  <p className="text-xs text-slate-500">{category.slug}</p>
                </div>

                <div className="space-x-3">
                  <button
                    className="text-blue-600"
                    onClick={() => setEditing(category)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => requestDelete(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {!categories.length && (
              <div className="text-center text-slate-500 py-8">
                No categories found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <EditCategoryModal
          category={editing}
          onClose={() => setEditing(null)}
          onSaved={async (payload) => {
            await updateCategory(editing.id, payload);

            toast.success("Category updated");

            setEditing(null);

            load();
          }}
        />
      )}

      {/* REASSIGN MODAL */}
      {reassignCtx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-xl space-y-3">
            <h3 className="text-xl font-bold">
              Reassign products before deletion
            </h3>

            <p className="text-sm text-slate-600">
              Choose another category for attached products or create a new
              category.
            </p>

            {/* SELECT CATEGORY */}
            <select
              className="w-full border rounded p-2"
              value={reassignCtx.selected}
              onChange={(e) =>
                setReassignCtx({
                  ...reassignCtx,
                  selected: e.target.value,
                })
              }
            >
              {reassignCtx.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            {/* QUICK CREATE */}
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded p-2"
                placeholder="Create new category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />

              <button
                className="px-3 py-2 border rounded"
                onClick={() =>
                  quickCreateCategory().catch(() =>
                    toast.error("Create category failed"),
                  )
                }
              >
                Add
              </button>
            </div>

            {/* ACTIONS */}
            <div className="text-right space-x-2">
              <button onClick={() => setReassignCtx(null)}>Cancel</button>

              <button
                className="bg-slate-900 text-white px-3 py-1 rounded"
                onClick={() =>
                  confirmReassignDelete().catch(() =>
                    toast.error("Reassign delete failed"),
                  )
                }
              >
                Reassign & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// EDIT MODAL
function EditCategoryModal({ category, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
        <h3 className="font-bold">Edit Category</h3>

        <input
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-2 rounded"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <div className="text-right space-x-2">
          <button onClick={onClose}>Cancel</button>

          <button
            className="bg-slate-900 text-white px-3 py-1 rounded"
            onClick={() =>
              onSaved(form).catch(() => toast.error("Update failed"))
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

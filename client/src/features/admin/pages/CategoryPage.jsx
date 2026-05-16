import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryForm from "../components/CategoryForm";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "../services/categoryService";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // edit state
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();

      setCategories((res.data || []).filter((cat) => !cat.isDeleted));
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      await updateCategory(editingCategory.id, editingCategory);
      toast.success("Category updated");
      setEditingCategory(null);
      fetchCategories();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CREATE */}
          <div className="bg-white p-5 rounded-xl shadow">
            <CategoryForm onSuccess={fetchCategories} />
          </div>

          {/* LIST */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-4">Categories</h2>

            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center border p-3 rounded mb-2"
              >
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.slug}</p>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDIT MODAL */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-[400px] space-y-4">
              <h2 className="text-lg font-bold">Edit Category</h2>

              <input
                className="w-full border p-2"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="w-full border p-2"
                value={editingCategory.slug}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    slug: e.target.value,
                  })
                }
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

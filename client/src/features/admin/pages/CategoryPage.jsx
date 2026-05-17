import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryForm from "../components/CategoryForm";
import { getCategories, deleteCategory, updateCategory } from "../services/categoryService";
import api from "../../../api/axios";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data || []);
  };

  useEffect(() => { fetchCategories().catch(() => toast.error("Failed to load categories")); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      if (err?.response?.data?.code === "CATEGORY_REASSIGN_REQUIRED") {
        const options = err.response.data.meta?.suggestedCategories || [];
        const picked = window.prompt(`This category has products. Reassign to category id:\n${options.map((o) => `${o.name}: ${o.id}`).join("\n")}`);
        if (!picked) return;
        await api.delete(`/categories/${id}`, { data: { reassignedCategoryId: picked } });
        toast.success("Category deleted and products reassigned");
        fetchCategories();
        return;
      }
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return <div className="space-y-4"><div className="bg-white p-4 rounded-xl"><CategoryForm onSuccess={fetchCategories} /></div>{categories.map((cat) => <div key={cat.id} className="bg-white border p-3 rounded flex justify-between"><div><p className="font-semibold">{cat.name}</p><p className="text-xs text-slate-500">{cat.slug}</p></div><div className="space-x-3"><button onClick={() => setEditingCategory(cat)} className="text-blue-600">Edit</button><button onClick={() => handleDelete(cat.id)} className="text-red-600">Delete</button></div></div>)}{editingCategory && <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-5 rounded w-96"><input className="w-full border p-2 mb-2" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} /><input className="w-full border p-2 mb-3" value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} /><div className="text-right space-x-2"><button onClick={() => setEditingCategory(null)}>Cancel</button><button className="bg-black text-white px-3 py-1 rounded" onClick={async () => { await updateCategory(editingCategory.id, editingCategory); setEditingCategory(null); fetchCategories(); }}>Save</button></div></div></div>}</div>;
}

import { useState } from "react";
import toast from "react-hot-toast";
import { createCategory } from "../services/categoryService";

export default function CategoryForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createCategory(formData);

      toast.success("Category created successfully 🎉");

      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
      });

      onSuccess?.(); // refresh list if needed
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create category",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <h2 className="text-xl font-bold">Create Category</h2>

      <input
        type="text"
        name="name"
        placeholder="Category Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        name="slug"
        placeholder="Slug (e.g. snacks)"
        value={formData.slug}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        name="image"
        placeholder="Image URL (optional)"
        value={formData.image}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded"
      >
        {loading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}

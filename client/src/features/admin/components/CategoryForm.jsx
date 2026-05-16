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

  // Auto-generate slug from name
  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // auto slug only if user is typing name
      if (name === "name") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        ...formData,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
      });

      toast.success("Category created successfully 🎉");

      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
      });

      onSuccess?.();
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
        placeholder="Slug (auto-generated)"
        value={formData.slug}
        onChange={handleChange}
        className="w-full border p-2 rounded bg-gray-50"
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
        className="w-full bg-black text-white p-2 rounded disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}

import { useEffect, useMemo, useState } from "react";

import { createProduct, getCategories } from "../services/adminProductService";

const initialState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  isFeatured: false,
  isAvailable: true,
};

export default function ProductForm() {
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const descriptionWords = formData.description.trim() ? formData.description.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response?.data ?? []);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const imagePreview = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (descriptionWords > 200) {
        setErrorMessage("Description must be 200 words or fewer");
        return;
      }

      setSubmitting(true);
      await createProduct(formData, imageFile);
      setSuccessMessage("Product created successfully.");
      setFormData(initialState);
      setImageFile(null);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded" required />

      <input type="text" name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} className="w-full border p-3 rounded" required />

      <textarea name="description" placeholder="Description (max 200 words)" value={formData.description} onChange={handleChange} className="w-full border p-3 rounded" rows={4} />
      <p className="text-xs text-gray-500">{descriptionWords}/200 words</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" min="0" step="0.01" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full border p-3 rounded" required />

        <input type="number" min="0" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full border p-3 rounded" required />
      </div>

      <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border p-3 rounded" required>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {loadingCategories && <p className="text-sm text-gray-600">Loading categories...</p>}

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
          Featured Product
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
          Available
        </label>
      </div>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full border p-3 rounded"
      />

      {imagePreview && <img src={imagePreview} alt="Product preview" className="w-40 h-40 object-cover rounded-lg border" />}

      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      {successMessage && <p className="text-green-700 text-sm">{successMessage}</p>}

      <button disabled={submitting} className="bg-black text-white px-6 py-3 rounded disabled:opacity-60">
        {submitting ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}

import { useState } from "react";

import ImageUpload from "./ImageUpload";

import { createProduct } from "../services/adminProductService";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",

    slug: "",

    description: "",

    price: "",

    stock: "",

    categoryId: "",

    image: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(formData);

      alert("Product created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="text"
        name="slug"
        placeholder="Slug"
        value={formData.slug}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="text"
        name="categoryId"
        placeholder="Category ID"
        value={formData.categoryId}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <ImageUpload
        image={formData.image}
        setImage={(url) =>
          setFormData((prev) => ({
            ...prev,

            image: url,
          }))
        }
      />

      <button className="bg-black text-white px-6 py-3 rounded">
        Create Product
      </button>
    </form>
  );
}

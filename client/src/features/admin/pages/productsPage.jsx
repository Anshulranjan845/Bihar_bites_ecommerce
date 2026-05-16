import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

import { getCategories } from "../../admin/services/categoryService.js";
import { getProducts, deleteProduct } from "../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // UI state
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products", {
        params: {
          page,
          limit,
          search,
          categoryId: categoryFilter,
          stock: stockFilter,
        },
      });

      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, stockFilter]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;

    try {
      await deleteProduct(id);
      toast.success("Deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editingProduct.name);
      formData.append("price", editingProduct.price);
      formData.append("stock", editingProduct.stock);
      formData.append("categoryId", editingProduct.categoryId);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/products/${editingProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated");

      setEditingProduct(null);
      setImageFile(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Admin Panel</h1>

          <input
            className="border p-2 rounded"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 flex-wrap">
          <select
            className="border p-2 rounded"
            value={categoryFilter}
            onChange={(e) => {
              setPage(1);
              setCategoryFilter(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={stockFilter}
            onChange={(e) => {
              setPage(1);
              setStockFilter(e.target.value);
            }}
          >
            <option value="">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={p.image}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>

                  <td>{p.name}</td>

                  <td>{p.category?.name}</td>

                  <td>₹{p.price}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        p.stock < 5 ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[450px] p-6 rounded space-y-3">
            <h2 className="text-xl font-bold">Edit Product</h2>

            <input
              className="w-full border p-2"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: e.target.value,
                })
              }
            />

            <select
              className="w-full border p-2"
              value={editingProduct.categoryId}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  categoryId: e.target.value,
                })
              }
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setImageFile(null);
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

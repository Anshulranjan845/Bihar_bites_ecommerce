import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../api/axios";

import { getCategories } from "../services/categoryService";
import { deleteProduct } from "../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products", {
        params: {
          page,
          limit,
          search,
          categoryId: categoryFilter,
          includeUnavailable: true,
        },
      });

      setProducts(res.data.products || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchCategories();
  }, []);

  // FETCH PRODUCTS ON PAGE/FILTER CHANGE
  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter]);

  // SEARCH DEBOUNCE
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product from inventory?");

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      toast.success("Product deleted");

      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // PAGINATION BUTTONS
  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>

          <p className="text-xs text-slate-500 mt-1">
            Tip: After category update, filters reset so updated item remains
            visible.
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="rounded-lg bg-slate-900 text-white px-4 py-2"
        >
          + Add Product
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border rounded-lg px-3 py-2 min-w-[240px]"
        />

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading products...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Image</th>

                <th className="text-left">Name</th>

                <th className="text-left">Category</th>

                <th className="text-left">Price</th>

                <th className="text-left">Stock</th>

                <th className="text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>

                  <td>{product.name}</td>

                  <td>{product.category?.name}</td>

                  <td>₹{product.price}</td>

                  <td>{product.stock}</td>

                  <td className="space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!products.length && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {pageButtons.map((number) => (
          <button
            key={number}
            onClick={() => setPage(number)}
            className={`px-3 py-1 border rounded ${
              number === page ? "bg-slate-900 text-white" : ""
            }`}
          >
            {number}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSaved={() => {
            setEditingProduct(null);

            // reset filters after update
            setCategoryFilter("");
            setPage(1);

            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

// EDIT PRODUCT MODAL
function EditProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId,
  });

  const save = async () => {
    await api.put(`/products/${product.id}`, {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
    });

    toast.success("Product updated successfully");

    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-lg space-y-3">
        <h3 className="text-xl font-bold">Edit Product</h3>

        <input
          className="w-full border rounded p-2"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="w-full border rounded p-2"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            className="w-full border rounded p-2"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: Number(e.target.value),
              })
            }
          />
        </div>

        <select
          className="w-full border rounded p-2"
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
            })
          }
        >
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="text-right space-x-2">
          <button onClick={onClose}>Cancel</button>

          <button
            className="bg-slate-900 text-white px-3 py-1 rounded"
            onClick={() => save().catch(() => toast.error("Update failed"))}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { getCategories } from "../services/categoryService";
import { deleteProduct } from "../services/productService";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const stockColor = (n) => {
  if (n === 0) return { color: "#ef4444", bg: "#fee2e2" };
  if (n <= 5) return { color: "#f59e0b", bg: "#fef3c7" };
  return { color: "#10b981", bg: "#d1fae5" };
};

// ─── icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);
const SearchIcon = () => (
  <Ico
    d={
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    }
  />
);
const EditIcon = () => (
  <Ico
    d={
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    }
  />
);
const TrashIcon = () => (
  <Ico
    d={
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </>
    }
  />
);
const XIcon = () => (
  <Ico
    d={
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    }
  />
);
const ChevLeft = () => <Ico d={<polyline points="15 18 9 12 15 6" />} />;
const ChevRight = () => <Ico d={<polyline points="9 18 15 12 9 6" />} />;
const PlusIcon = () => (
  <Ico
    d={
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    }
  />
);
const BoxIcon = () => (
  <Ico
    d={
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    }
    size={18}
  />
);

// ─── main page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const LIMIT = 8;

  const fetchProducts = useCallback(
    async (overridePage = page) => {
      setLoading(true);
      try {
        const res = await api.get("/products", {
          params: {
            page: overridePage,
            limit: LIMIT,
            search,
            categoryId: categoryFilter,
            includeUnavailable: true,
          },
        });
        setProducts(res.data.products || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || 0);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    },
    [page, search, categoryFilter],
  );

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter]);

  // debounce search
  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchProducts(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleDelete = async (product) => {
    setConfirmDelete(product);
  };

  const confirmAndDelete = async () => {
    const id = confirmDelete.id;
    setConfirmDelete(null);
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const pageButtons = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3)
      return [
        1,
        "…",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [totalPages, page]);

  return (
    <div style={s.page}>
      {/* header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={s.headerIcon}>
            <BoxIcon />
          </div>
          <div>
            <p style={s.eyebrow}>Admin · Inventory</p>
            <h1 style={s.title}>Products</h1>
          </div>
        </div>
        <Link to="/admin/products/create" style={s.addBtn}>
          <PlusIcon /> Add product
        </Link>
      </div>

      {/* filters */}
      <div style={s.filterBar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>
            <SearchIcon />
          </span>
          <input
            style={s.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
          />
        </div>
        <select
          style={s.select}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {(search || categoryFilter) && (
          <button
            style={s.clearBtn}
            onClick={() => {
              setSearch("");
              setCategoryFilter("");
              setPage(1);
            }}
          >
            Clear filters
          </button>
        )}
        <span style={s.countLabel}>{totalCount} products</span>
      </div>

      {/* table */}
      <div style={s.tableWrap}>
        {loading ? (
          <div style={s.skeletonWrap}>
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} style={s.skeletonRow} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={s.empty}>
            <BoxIcon />
            <p style={s.emptyText}>No products found</p>
            <p style={s.emptyHint}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["", "Product", "Category", "Price", "Stock", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      style={{
                        ...s.th,
                        ...(i === 0
                          ? { width: 64 }
                          : i === 5
                            ? { width: 80 }
                            : {}),
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const sc = stockColor(product.stock);
                return (
                  <tr key={product.id} style={s.tr}>
                    <td style={s.td}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={s.productImg}
                        onError={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                        }}
                      />
                    </td>
                    <td style={s.td}>
                      <p style={s.productName}>{product.name}</p>
                      <p style={s.productId}>#{product.id}</p>
                    </td>
                    <td style={s.td}>
                      <span style={s.categoryChip}>
                        {product.category?.name || "—"}
                      </span>
                    </td>
                    <td style={{ ...s.td, fontWeight: 600, color: "#111827" }}>
                      {fmt(product.price)}
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.stockBadge,
                          color: sc.color,
                          background: sc.bg,
                        }}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={s.rowActions}>
                        <ActionBtn
                          color="#3b82f6"
                          title="Edit"
                          onClick={() => setEditingProduct(product)}
                        >
                          <EditIcon />
                        </ActionBtn>
                        <ActionBtn
                          color="#ef4444"
                          title="Delete"
                          loading={deletingId === product.id}
                          onClick={() => handleDelete(product)}
                        >
                          <TrashIcon />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button
            style={{ ...s.pageBtn, ...(page === 1 ? s.pageBtnDisabled : {}) }}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevLeft />
          </button>
          {pageButtons.map((n, i) =>
            n === "…" ? (
              <span key={`ellipsis-${i}`} style={s.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={n}
                style={{ ...s.pageBtn, ...(n === page ? s.pageBtnActive : {}) }}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ),
          )}
          <button
            style={{
              ...s.pageBtn,
              ...(page === totalPages ? s.pageBtnDisabled : {}),
            }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevRight />
          </button>
        </div>
      )}

      {/* edit modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSaved={() => {
            setEditingProduct(null);
            setCategoryFilter("");
            setPage(1);
            fetchProducts(1);
          }}
        />
      )}

      {/* delete confirm modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          product={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmAndDelete}
        />
      )}
    </div>
  );
}

// ─── edit modal ───────────────────────────────────────────────────────────────

function EditProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/products/${product.id}`, {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId,
      });
      toast.success("Product updated");
      onSaved();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            )}
            <div>
              <h3 style={s.modalTitle}>Edit product</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                {product.name}
              </p>
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div style={s.modalBody}>
          <Field label="Name">
            <input
              style={s.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Price (₹)">
              <input
                style={s.input}
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label="Stock">
              <input
                style={s.input}
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Category">
            <select
              style={s.input}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div style={s.modalFooter}>
          <button style={s.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={{ ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ─── confirm delete modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({ product, onCancel, onConfirm }) {
  return (
    <Overlay onClose={onCancel}>
      <div style={{ ...s.modal, maxWidth: 380 }}>
        <div style={s.modalHeader}>
          <h3 style={s.modalTitle}>Delete product?</h3>
          <button style={s.closeBtn} onClick={onCancel}>
            <XIcon />
          </button>
        </div>
        <div style={s.modalBody}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            <strong>{product.name}</strong> will be permanently removed from
            inventory. This cannot be undone.
          </p>
        </div>
        <div style={s.modalFooter}>
          <button style={s.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={s.dangerBtn} onClick={onConfirm}>
            Delete product
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ─── primitives ───────────────────────────────────────────────────────────────

function Overlay({ children, onClose }) {
  return (
    <div
      style={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function ActionBtn({ onClick, color, title, loading, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      disabled={loading}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...s.actionBtn,
        color: hov ? color : "#9ca3af",
        background: hov ? color + "14" : "transparent",
        opacity: loading ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const s = {
  page: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#f3f4f6",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  title: {
    margin: "3px 0 0",
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "#111827",
    borderRadius: 9,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  filterBar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    padding: "12px 16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    padding: "0 12px",
    flex: "1 1 200px",
  },
  searchIcon: { color: "#9ca3af", display: "flex" },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    padding: "9px 0",
    color: "#111827",
    background: "transparent",
  },
  select: {
    padding: "9px 12px",
    fontSize: 14,
    color: "#374151",
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    outline: "none",
    cursor: "pointer",
  },
  clearBtn: {
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
  },
  countLabel: {
    marginLeft: "auto",
    fontSize: 12,
    fontWeight: 600,
    color: "#9ca3af",
    whiteSpace: "nowrap",
  },
  tableWrap: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  skeletonWrap: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
    gap: 8,
  },
  skeletonRow: {
    height: 56,
    borderRadius: 9,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaeb 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "4rem 0",
    color: "#d1d5db",
  },
  emptyText: { margin: 0, fontSize: 15, fontWeight: 600, color: "#9ca3af" },
  emptyHint: { margin: 0, fontSize: 13, color: "#d1d5db" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    fontWeight: 600,
    color: "#9ca3af",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    padding: "12px 16px",
    borderBottom: "1px solid #f3f4f6",
    background: "#fafafa",
  },
  tr: { transition: "background 0.1s" },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f9fafb",
    verticalAlign: "middle",
    color: "#374151",
  },
  productImg: {
    width: 40,
    height: 40,
    objectFit: "cover",
    borderRadius: 8,
    background: "#f3f4f6",
    display: "block",
  },
  productName: { margin: 0, fontWeight: 600, color: "#111827", fontSize: 14 },
  productId: {
    margin: "2px 0 0",
    fontSize: 11,
    color: "#d1d5db",
    fontFamily: "monospace",
  },
  categoryChip: {
    display: "inline-block",
    padding: "3px 9px",
    background: "#f3f4f6",
    color: "#374151",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 500,
  },
  stockBadge: {
    display: "inline-block",
    padding: "3px 9px",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 600,
  },
  rowActions: { display: "flex", gap: 4 },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "color 0.15s, background 0.15s",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  pageBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 36,
    height: 36,
    padding: "0 8px",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  pageBtnActive: {
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
  },
  pageBtnDisabled: { opacity: 0.35, cursor: "not-allowed" },
  ellipsis: { fontSize: 13, color: "#9ca3af", padding: "0 4px" },

  // modal shared
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #f3f4f6",
  },
  modalTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
  },
  modalBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "16px 20px",
    borderTop: "1px solid #f3f4f6",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    color: "#111827",
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    outline: "none",
    boxSizing: "border-box",
  },
  cancelBtn: {
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    cursor: "pointer",
  },
  primaryBtn: {
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "#111827",
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "#ef4444",
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
  },
};

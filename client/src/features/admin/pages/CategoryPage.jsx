import { useEffect, useCallback, useState } from "react";
import toast from "react-hot-toast";
import CategoryForm from "../components/CategoryForm";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

// ─── helpers ─────────────────────────────────────────────────────────────────

const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ─── icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 16 }) => (
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

const EditIcon = () => (
  <Icon
    d={
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    }
  />
);
const TrashIcon = () => (
  <Icon
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
  <Icon
    d={
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    }
  />
);
const TagIcon = () => (
  <Icon
    d={
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </>
    }
    size={18}
  />
);
const AlertIcon = () => (
  <Icon
    d={
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    }
    size={20}
  />
);
const PlusIcon = () => (
  <Icon
    d={
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    }
  />
);

// ─── main page ────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [reassignCtx, setReassignCtx] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const requestDelete = async (categoryId) => {
    setDeletingId(categoryId);
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
    } finally {
      setDeletingId(null);
    }
  };

  const confirmReassignDelete = async () => {
    try {
      await deleteCategory(reassignCtx.categoryId, {
        reassignedCategoryId: reassignCtx.selected,
      });
      toast.success("Category deleted and products reassigned");
      setReassignCtx(null);
      load();
    } catch {
      toast.error("Reassign delete failed");
    }
  };

  const quickCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      await createCategory({ name, slug: toSlug(name) });
      toast.success("New category created");
      setNewCategoryName("");
      load();
    } catch {
      toast.error("Create category failed");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <p style={s.eyebrow}>Admin</p>
        <h1 style={s.pageTitle}>Categories</h1>
      </div>

      <div style={s.grid}>
        {/* ── create form panel ── */}
        <div style={s.panel}>
          <p style={s.panelLabel}>New category</p>
          <CategoryForm onSuccess={load} />
        </div>

        {/* ── category list ── */}
        <div style={{ ...s.panel, ...s.listPanel }}>
          <div style={s.listHeader}>
            <p style={s.panelLabel}>All categories</p>
            <span style={s.countBadge}>{categories.length}</span>
          </div>

          {loading ? (
            <div style={s.skeletonWrap}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={s.skeleton} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div style={s.empty}>
              <TagIcon />
              <p style={s.emptyText}>No categories yet</p>
            </div>
          ) : (
            <ul style={s.list}>
              {categories.map((cat, i) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  index={i}
                  isDeleting={deletingId === cat.id}
                  onEdit={() => setEditing(cat)}
                  onDelete={() => requestDelete(cat.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── edit modal ── */}
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

      {/* ── reassign modal ── */}
      {reassignCtx && (
        <ReassignModal
          ctx={reassignCtx}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          onCtxChange={setReassignCtx}
          onCancel={() => setReassignCtx(null)}
          onConfirm={confirmReassignDelete}
          onQuickCreate={quickCreateCategory}
        />
      )}
    </div>
  );
}

// ─── category row ─────────────────────────────────────────────────────────────

function CategoryRow({ category, index, isDeleting, onEdit, onDelete }) {
  const colors = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
  ];
  const accent = colors[index % colors.length];

  return (
    <li style={s.row}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ ...s.rowDot, background: accent + "22", color: accent }}>
          <TagIcon />
        </div>
        <div>
          <p style={s.rowName}>{category.name}</p>
          <p style={s.rowSlug}>{category.slug}</p>
        </div>
      </div>
      <div style={s.rowActions}>
        <ActionBtn onClick={onEdit} title="Edit" color="#3b82f6">
          <EditIcon />
        </ActionBtn>
        <ActionBtn
          onClick={onDelete}
          title="Delete"
          color="#ef4444"
          loading={isDeleting}
        >
          <TrashIcon />
        </ActionBtn>
      </div>
    </li>
  );
}

function ActionBtn({ onClick, title, color, loading, children }) {
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
        opacity: loading ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

// ─── edit modal ───────────────────────────────────────────────────────────────

function EditCategoryModal({ category, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
  });
  const [saving, setSaving] = useState(false);
  const autoSlug = toSlug(form.name);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaved(form);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div style={s.modal}>
        <ModalHeader title="Edit category" onClose={onClose} />

        <div style={s.fieldGroup}>
          <Field label="Name">
            <input
              style={s.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Category name"
              autoFocus
            />
          </Field>
          <Field label="Slug">
            <input
              style={s.input}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder={autoSlug || "category-slug"}
            />
            {form.slug !== autoSlug && (
              <button
                style={s.slugHint}
                onClick={() => setForm({ ...form, slug: autoSlug })}
              >
                Use "{autoSlug}"
              </button>
            )}
          </Field>
        </div>

        <div style={s.modalFooter}>
          <button style={s.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={{ ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ─── reassign modal ───────────────────────────────────────────────────────────

function ReassignModal({
  ctx,
  newCategoryName,
  setNewCategoryName,
  onCtxChange,
  onCancel,
  onConfirm,
  onQuickCreate,
}) {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm();
    setSaving(false);
  };

  return (
    <Overlay onClose={onCancel}>
      <div style={s.modal}>
        <ModalHeader title="Reassign products" onClose={onCancel} />

        <div style={s.warningBanner}>
          <AlertIcon />
          <p style={s.warningText}>
            This category has products attached. Choose a new home for them
            before deleting.
          </p>
        </div>

        <div style={s.fieldGroup}>
          <Field label="Move products to">
            <select
              style={s.input}
              value={ctx.selected}
              onChange={(e) =>
                onCtxChange({ ...ctx, selected: e.target.value })
              }
            >
              {ctx.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Or create a new category">
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...s.input, flex: 1 }}
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onQuickCreate()}
              />
              <button style={s.addBtn} onClick={onQuickCreate}>
                <PlusIcon /> Add
              </button>
            </div>
          </Field>
        </div>

        <div style={s.modalFooter}>
          <button style={s.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{ ...s.dangerBtn, opacity: saving ? 0.7 : 1 }}
            onClick={handleConfirm}
            disabled={saving}
          >
            {saving ? "Processing…" : "Reassign & delete"}
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

function ModalHeader({ title, onClose }) {
  return (
    <div style={s.modalHeader}>
      <h3 style={s.modalTitle}>{title}</h3>
      <button style={s.closeBtn} onClick={onClose}>
        <XIcon />
      </button>
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

// ─── styles ───────────────────────────────────────────────────────────────────

const s = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  pageHeader: { display: "flex", flexDirection: "column", gap: 4 },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  pageTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 16,
    alignItems: "start",
  },
  panel: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 14,
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  listPanel: { padding: 0, overflow: "hidden" },
  panelLabel: {
    margin: "0 0 12px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#9ca3af",
    padding: "20px 20px 0",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "20px 20px 0",
    marginBottom: 12,
  },
  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 22,
    height: 22,
    padding: "0 6px",
    background: "#f3f4f6",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
  },
  skeletonWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    padding: "0 12px 12px",
  },
  skeleton: {
    height: 60,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaeb 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%",
    borderRadius: 10,
    animation: "shimmer 1.4s infinite",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "3rem 0",
    color: "#d1d5db",
  },
  emptyText: { margin: 0, fontSize: 14, color: "#9ca3af" },
  list: {
    listStyle: "none",
    margin: 0,
    padding: "0 0 8px",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: "1px solid #f9fafb",
    transition: "background 0.12s",
  },
  rowDot: {
    width: 36,
    height: 36,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowName: { margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" },
  rowSlug: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
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

  // overlay + modal
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
    maxWidth: 440,
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
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: "20px",
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
    transition: "border-color 0.15s",
  },
  slugHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#6366f1",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "underline",
    textDecorationStyle: "dotted",
  },
  warningBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    margin: "0 20px",
    padding: "12px 14px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 10,
    color: "#c2410c",
  },
  warningText: { margin: 0, fontSize: 13, lineHeight: 1.5, color: "#9a3412" },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "0 14px",
    height: 40,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 9,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "16px 20px",
    borderTop: "1px solid #f3f4f6",
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

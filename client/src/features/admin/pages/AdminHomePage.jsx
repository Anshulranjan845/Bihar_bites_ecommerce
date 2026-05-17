import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_META = {
  pending: { color: "#f59e0b", bg: "#fef3c7", label: "Pending" },
  processing: { color: "#3b82f6", bg: "#dbeafe", label: "Processing" },
  shipped: { color: "#8b5cf6", bg: "#ede9fe", label: "Shipped" },
  delivered: { color: "#10b981", bg: "#d1fae5", label: "Delivered" },
  cancelled: { color: "#ef4444", bg: "#fee2e2", label: "Cancelled" },
};

const statusMeta = (status = "") =>
  STATUS_META[status.toLowerCase()] ?? {
    color: "#6b7280",
    bg: "#f3f4f6",
    label: status,
  };

const downloadCsv = (rows, filename) => {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    ),
    download: filename,
  });
  a.click();
};

// ─── main component ──────────────────────────────────────────────────────────

export default function AdminHomePage({ section }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [pRes, oRes, cRes] = await Promise.all([
          api.get("/products", {
            params: { limit: 200, includeUnavailable: true },
          }),
          api.get("/orders/admin/all"),
          api.get("/categories"),
        ]);
        setProducts(pRes.data.products || []);
        setOrders(oRes.data.data || []);
        setCategories(cRes.data.data || []);
      } catch {
        /* handled silently */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const revenue = useMemo(
    () => orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
    [orders],
  );

  const ordersByStatus = useMemo(
    () =>
      orders.reduce(
        (acc, o) => ({
          ...acc,
          [o.orderStatus]: (acc[o.orderStatus] || 0) + 1,
        }),
        {},
      ),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        !q ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        String(o.id).includes(q);
      const matchStatus =
        statusFilter === "all" || o.orderStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const allStatuses = useMemo(
    () => ["all", ...Object.keys(ordersByStatus)],
    [ordersByStatus],
  );

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  // ── orders page ───────────────────────────────────────────────────────────
  if (section === "orders") {
    return (
      <PageShell>
        {/* header */}
        <div style={styles.pageHeader}>
          <div>
            <p style={styles.pageEyebrow}>Admin</p>
            <h1 style={styles.pageTitle}>Order Management</h1>
          </div>
          <button
            style={styles.exportBtn}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.exportBtnHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, styles.exportBtn)
            }
            onClick={() =>
              downloadCsv(
                [
                  [
                    "Order ID",
                    "Customer",
                    "Email",
                    "Amount (₹)",
                    "Status",
                    "Payment",
                  ],
                  ...orders.map((o) => [
                    o.id,
                    o.user?.name,
                    o.user?.email,
                    o.totalAmount,
                    o.orderStatus,
                    o.paymentStatus,
                  ]),
                ],
                "orders.csv",
              )
            }
          >
            <ExportIcon /> Export CSV
          </button>
        </div>

        {/* filters */}
        <div style={styles.filterBar}>
          <div style={styles.searchWrap}>
            <SearchIcon />
            <input
              style={styles.searchInput}
              placeholder="Search by name, email or order ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={styles.statusTabs}>
            {allStatuses.map((s) => (
              <button
                key={s}
                style={{
                  ...styles.tab,
                  ...(statusFilter === s ? styles.tabActive : {}),
                }}
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All orders" : s}
                <span
                  style={{
                    ...styles.tabCount,
                    ...(statusFilter === s ? styles.tabCountActive : {}),
                  }}
                >
                  {s === "all" ? orders.length : ordersByStatus[s] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* order list */}
        <div style={styles.orderList}>
          {filteredOrders.length === 0 ? (
            <EmptyState message="No orders match your filters." />
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </PageShell>
    );
  }

  // ── dashboard page ────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div>
        <p style={styles.pageEyebrow}>Overview</p>
        <h1 style={styles.pageTitle}>Dashboard</h1>
      </div>

      {/* stat cards */}
      <div style={styles.statGrid}>
        <StatCard
          icon={<BoxIcon />}
          label="Products"
          value={products.length}
          accent="#6366f1"
        />
        <StatCard
          icon={<CartIcon />}
          label="Orders"
          value={orders.length}
          accent="#f59e0b"
        />
        <StatCard
          icon={<TagIcon />}
          label="Categories"
          value={categories.length}
          accent="#10b981"
        />
        <StatCard
          icon={<RupeeIcon />}
          label="Revenue"
          value={fmt(revenue)}
          accent="#ef4444"
          isMoney
        />
      </div>

      {/* order status breakdown */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Orders by status</h3>
        <div style={styles.statusList}>
          {Object.entries(ordersByStatus).map(([status, count]) => {
            const pct = Math.max(
              6,
              Math.round((count / Math.max(1, orders.length)) * 100),
            );
            const meta = statusMeta(status);
            return (
              <div key={status} style={styles.statusRow}>
                <div style={styles.statusRowTop}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{ ...styles.statusDot, background: meta.color }}
                    />
                    <span style={styles.statusLabel}>{meta.label}</span>
                  </div>
                  <span style={styles.statusCount}>{count}</span>
                </div>
                <div style={styles.track}>
                  <div
                    style={{
                      ...styles.fill,
                      width: `${pct}%`,
                      background: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* recent orders table preview */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Recent orders</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Customer", "Items", "Amount", "Status"].map((h) => (
                <th key={h} style={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => {
              const meta = statusMeta(o.orderStatus);
              return (
                <tr key={o.id} style={styles.tr}>
                  <td style={styles.td}>
                    <p style={styles.customerName}>{o.user?.name}</p>
                    <p style={styles.customerEmail}>{o.user?.email}</p>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.itemCount}>
                      {o.orderItems?.length || 0} item
                      {o.orderItems?.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>
                    {fmt(o.totalAmount || 0)}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        color: meta.color,
                        background: meta.bg,
                      }}
                    >
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

function PageShell({ children }) {
  return <div style={styles.shell}>{children}</div>;
}

function StatCard({ icon, label, value, accent, isMoney }) {
  return (
    <div
      style={styles.statCard}
      onMouseEnter={(e) =>
        Object.assign(e.currentTarget.style, {
          ...styles.statCard,
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        })
      }
      onMouseLeave={(e) =>
        Object.assign(e.currentTarget.style, styles.statCard)
      }
    >
      <div
        style={{ ...styles.statIcon, background: accent + "18", color: accent }}
      >
        {icon}
      </div>
      <p style={styles.statLabel}>{label}</p>
      <p
        style={{
          ...styles.statValue,
          ...(isMoney ? styles.statValueMoney : {}),
        }}
      >
        {value}
      </p>
    </div>
  );
}

function OrderCard({ order }) {
  const meta = statusMeta(order.orderStatus);
  return (
    <div style={styles.orderCard}>
      <div style={styles.orderCardHeader}>
        <div>
          <p style={styles.orderCustomer}>{order.user?.name}</p>
          <p style={styles.orderEmail}>{order.user?.email}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={styles.orderAmount}>{fmt(order.totalAmount || 0)}</p>
          <span
            style={{ ...styles.badge, color: meta.color, background: meta.bg }}
          >
            {meta.label}
          </span>
        </div>
      </div>
      <div style={styles.orderMeta}>
        <span style={styles.orderMetaItem}>Payment: {order.paymentStatus}</span>
        <span style={styles.orderMetaDot}>·</span>
        <span style={styles.orderMetaItem}>
          {order.orderItems
            ?.map((i) => `${i.product?.name} ×${i.quantity}`)
            .join(", ")}
        </span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={styles.shell}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={styles.skeleton} />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={styles.emptyState}>
      <p style={styles.emptyText}>{message}</p>
    </div>
  );
}

// ─── inline icons (tiny svg) ─────────────────────────────────────────────────

const icon = (path, vb = "0 0 24 24") => (
  <svg
    width={20}
    height={20}
    viewBox={vb}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);

const BoxIcon = () =>
  icon(
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </>,
  );
const CartIcon = () =>
  icon(
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>,
  );
const TagIcon = () =>
  icon(
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>,
  );
const RupeeIcon = () =>
  icon(
    <>
      <line x1="6" y1="3" x2="18" y2="3" />
      <line x1="6" y1="8" x2="18" y2="8" />
      <line x1="8" y1="3" x2="6" y2="21" />
      <path d="M6 8h6a4 4 0 0 1 0 8H6l8 6" />
    </>,
  );
const SearchIcon = () =>
  icon(
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>,
  );
const ExportIcon = () =>
  icon(
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>,
  );

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = {
  shell: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 12,
  },
  pageEyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  pageTitle: {
    margin: "4px 0 0",
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "#111827",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  },
  exportBtnHover: {
    background: "#374151",
  },
  filterBar: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "0 14px",
    color: "#9ca3af",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    padding: "11px 0",
    color: "#111827",
    background: "transparent",
  },
  statusTabs: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 500,
    color: "#6b7280",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
    textTransform: "capitalize",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#111827",
    background: "#f3f4f6",
    borderColor: "#d1d5db",
  },
  tabCount: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
    height: 20,
    padding: "0 5px",
    background: "#f3f4f6",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
  },
  tabCountActive: {
    background: "#e5e7eb",
    color: "#111827",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  orderCard: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    padding: "16px 20px",
    transition: "box-shadow 0.15s",
  },
  orderCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  orderCustomer: { margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" },
  orderEmail: { margin: "2px 0 0", fontSize: 13, color: "#9ca3af" },
  orderAmount: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    textAlign: "right",
  },
  orderMeta: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #f3f4f6",
  },
  orderMetaItem: { fontSize: 12, color: "#6b7280" },
  orderMetaDot: { color: "#d1d5db", fontSize: 12 },
  badge: {
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "capitalize",
    letterSpacing: "0.02em",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 12,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 14,
    padding: "18px 20px",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  statIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 10,
    marginBottom: 14,
  },
  statLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#9ca3af",
  },
  statValue: {
    margin: "6px 0 0",
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  statValueMoney: {
    fontSize: 20,
  },
  card: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 14,
    padding: "20px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  statusList: { display: "flex", flexDirection: "column", gap: 14 },
  statusRow: {},
  statusRowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusLabel: { fontSize: 13, color: "#374151", textTransform: "capitalize" },
  statusCount: { fontSize: 13, fontWeight: 700, color: "#111827" },
  track: {
    height: 5,
    background: "#f3f4f6",
    borderRadius: 9999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
    transition: "width 0.6s ease",
    opacity: 0.8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left",
    fontWeight: 600,
    color: "#9ca3af",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    paddingBottom: 10,
    borderBottom: "1px solid #f3f4f6",
  },
  tr: {},
  td: {
    padding: "12px 0",
    borderBottom: "1px solid #f9fafb",
    verticalAlign: "middle",
    color: "#374151",
    paddingRight: 16,
  },
  customerName: { margin: 0, fontWeight: 600, color: "#111827" },
  customerEmail: { margin: "2px 0 0", color: "#9ca3af", fontSize: 12 },
  itemCount: { color: "#6b7280" },
  skeleton: {
    height: 80,
    background: "linear-gradient(90deg, #f3f4f6 25%, #e9eaeb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    borderRadius: 12,
  },
  emptyState: {
    padding: "3rem 0",
    textAlign: "center",
  },
  emptyText: {
    margin: 0,
    color: "#9ca3af",
    fontSize: 14,
  },
};

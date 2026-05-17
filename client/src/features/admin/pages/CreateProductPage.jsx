import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.iconWrap}>
          <BoxIcon />
        </div>
        <div>
          <p style={s.eyebrow}>Admin · Products</p>
          <h1 style={s.title}>Create product</h1>
        </div>
      </div>

      <div style={s.card}>
        <ProductForm />
      </div>
    </div>
  );
}

function BoxIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

const s = {
  page: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "1.75rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
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
  card: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 16,
    padding: "28px 28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
};

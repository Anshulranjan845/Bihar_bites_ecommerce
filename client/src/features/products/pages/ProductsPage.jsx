import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { getProducts } from "../services/productService";
import useCartStore from "../../cart/store/cartStore";

// ── Mithila SVG motif (same as homepage for brand consistency) ────────────────
function MithilaMotif({ opacity = 0.045 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="mp"
          x="0"
          y="0"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <g opacity={opacity} fill="none" stroke="#b45309" strokeWidth="1.1">
            <circle cx="80" cy="80" r="50" />
            <circle cx="80" cy="80" r="32" />
            <circle cx="80" cy="80" r="14" />
            <line x1="80" y1="30" x2="80" y2="130" />
            <line x1="30" y1="80" x2="130" y2="80" />
            <line x1="44" y1="44" x2="116" y2="116" />
            <line x1="116" y1="44" x2="44" y2="116" />
            <ellipse cx="80" cy="48" rx="6" ry="15" />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(45 80 80)"
            />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(90 80 80)"
            />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(135 80 80)"
            />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(180 80 80)"
            />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(225 80 80)"
            />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(270 80 80)"
            />
            <ellipse
              cx="80"
              cy="48"
              rx="6"
              ry="15"
              transform="rotate(315 80 80)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mp)" />
    </svg>
  );
}

// ── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "popular", label: "Most Popular" },
];

// ── Lazy image with shimmer ───────────────────────────────────────────────────
function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden bg-amber-50">
      {!loaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 bg-[length:200%_100%]" />
      )}
      <img
        src={
          src || "https://placehold.co/400x300/fef3c7/b45309?text=Bihar+Bites"
        }
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index, view }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        className="group bg-white border border-amber-100 rounded-2xl overflow-hidden flex gap-0 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
      >
        <div className="w-36 sm:w-48 flex-shrink-0 relative overflow-hidden">
          <LazyImage src={product.image} alt={product.name} />
          {product.badge && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
          <div>
            <p
              className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-1"
              style={{ fontFamily: "sans-serif" }}
            >
              {product.category?.name}
            </p>
            <h3
              className="font-bold text-zinc-900 text-base line-clamp-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h3>
            <p
              className="text-zinc-500 text-sm line-clamp-2 mt-1 leading-relaxed"
              style={{ fontFamily: "sans-serif" }}
            >
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-zinc-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span
                  className="text-sm text-zinc-400 line-through"
                  style={{ fontFamily: "sans-serif" }}
                >
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                to={`/products/${product.slug}`}
                className="text-sm font-semibold px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition"
                style={{ fontFamily: "sans-serif" }}
              >
                Details
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${added ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-amber-700"}`}
                style={{ fontFamily: "sans-serif" }}
              >
                {added ? "✓ Added" : "Add to Cart"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group bg-white border border-amber-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden">
        <LazyImage src={product.image} alt={product.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2.5 py-1 rounded-full shadow">
            {product.badge}
          </span>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className={`absolute bottom-3 right-3 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg transition-all duration-300 ${added ? "bg-green-500 text-white opacity-100" : "bg-white text-zinc-900 opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white"}`}
          style={{ fontFamily: "sans-serif" }}
        >
          {added ? "✓ Added!" : "+ Cart"}
        </motion.button>
      </div>
      <div className="p-4">
        <p
          className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1"
          style={{ fontFamily: "sans-serif" }}
        >
          {product.category?.name}
        </p>
        <h3
          className="font-bold text-zinc-900 line-clamp-1 text-base"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {product.name}
        </h3>
        <p
          className="text-zinc-400 text-xs line-clamp-2 mt-1 leading-relaxed"
          style={{ fontFamily: "sans-serif" }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-zinc-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span
                className="text-xs text-zinc-400 line-through"
                style={{ fontFamily: "sans-serif" }}
              >
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {product.rating && (
            <span
              className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: "sans-serif" }}
            >
              ★ {product.rating}
            </span>
          )}
        </div>
        <Link
          to={`/products/${product.slug}`}
          className="mt-3 block text-center text-sm font-semibold py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-amber-700 transition-colors duration-300"
          style={{ fontFamily: "sans-serif" }}
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard({ view }) {
  if (view === "list")
    return (
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden flex animate-pulse">
        <div className="w-48 flex-shrink-0 bg-amber-50 h-36" />
        <div className="p-4 flex-1 space-y-3">
          <div className="h-3 w-1/4 bg-zinc-100 rounded" />
          <div className="h-4 w-2/3 bg-zinc-100 rounded" />
          <div className="h-3 w-full bg-zinc-100 rounded" />
          <div className="h-3 w-3/4 bg-zinc-100 rounded" />
          <div className="h-8 w-28 bg-zinc-100 rounded-xl mt-4" />
        </div>
      </div>
    );
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-amber-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-zinc-100 rounded" />
        <div className="h-4 w-3/4 bg-zinc-100 rounded" />
        <div className="h-3 w-full bg-zinc-100 rounded" />
        <div className="h-6 w-1/4 bg-zinc-100 rounded" />
        <div className="h-9 w-full bg-zinc-200 rounded-xl" />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3
        className="text-xl font-bold text-zinc-900 mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        No results found
      </h3>
      <p
        className="text-zinc-500 text-sm max-w-xs"
        style={{ fontFamily: "sans-serif" }}
      >
        {query
          ? `We couldn't find anything for "${query}". Try a different search.`
          : "No products in this category yet. Check back soon!"}
      </p>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 420);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const topRef = useRef(null);
  const cartCount = useCartStore((s) => s.cartItems.length);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        search: debouncedSearch,
        sort,
        page,
        category: selectedCategory,
      });
      setProducts(res.products || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort, page, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, selectedCategory]);

  const handlePageChange = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalPages = pagination.totalPages || 1;
  const totalProducts = pagination.total || products.length;

  return (
    <div
      className="min-h-screen bg-amber-50/40"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* ── PAGE HERO HEADER ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-amber-950 pt-10 pb-14">
        <MithilaMotif opacity={0.08} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#92400e55,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-5">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-amber-300/70 text-xs mb-6"
            aria-label="breadcrumb"
          >
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-amber-300">Products</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-2"
              >
                Authentic Bihar
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="text-4xl md:text-5xl font-extrabold text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Our Catalog
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-amber-200/60 text-sm mt-2"
              >
                {loading
                  ? "Loading products…"
                  : `${totalProducts} handpicked products from across Bihar`}
              </motion.p>
            </div>

            {/* Search bar in hero */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative w-full sm:w-80"
            >
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search thekua, sattu, khaja…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-lg leading-none"
                  >
                    ✕
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-10"
          >
            <path
              d="M0 40 Q720 0 1440 40 L1440 40 L0 40Z"
              fill="rgb(255 251 235 / 0.4)"
            />
          </svg>
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────── */}
      <div ref={topRef} className="max-w-7xl mx-auto px-5 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-amber-200 bg-white text-zinc-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                ▾
              </span>
            </div>

            {/* Active filter chips */}
            <AnimatePresence>
              {debouncedSearch && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-2 rounded-full"
                >
                  Search: "{debouncedSearch}"
                  <button
                    onClick={() => setSearch("")}
                    className="text-amber-600 hover:text-amber-900 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </motion.span>
              )}
              {selectedCategory && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs font-semibold px-3 py-2 rounded-full"
                >
                  Category filtered
                  <Link
                    to="/products"
                    className="text-zinc-500 hover:text-zinc-800 text-sm leading-none font-bold"
                  >
                    ×
                  </Link>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white border border-amber-100 rounded-xl p-1 shadow-sm">
            {[
              { v: "grid", icon: "⊞" },
              { v: "list", icon: "≡" },
            ].map(({ v, icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`w-9 h-8 rounded-lg text-sm font-bold transition-all ${view === v ? "bg-amber-500 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-700"}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid / list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${page}-${sort}-${debouncedSearch}-${selectedCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "flex flex-col gap-4"
            }
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} view={view} />
              ))
            ) : products.length === 0 ? (
              <EmptyState query={debouncedSearch} />
            ) : (
              products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  view={view}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Pagination ──────────────────────────────────────────── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-14"
          >
            {/* Prev */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-200 bg-white text-zinc-700 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-sm"
            >
              ‹
            </button>

            {/* Page numbers with ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="text-zinc-400 text-sm px-1"
                  >
                    …
                  </span>
                ) : (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                      page === p
                        ? "bg-amber-500 text-white border border-amber-500 shadow-amber-200 shadow-md"
                        : "bg-white text-zinc-700 border border-amber-200 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    {p}
                  </motion.button>
                ),
              )}

            {/* Next */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-200 bg-white text-zinc-700 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-sm"
            >
              ›
            </button>
          </motion.div>
        )}

        {/* Page indicator */}
        {totalPages > 1 && (
          <p className="text-center text-xs text-zinc-400 mt-3">
            Page {page} of {totalPages} · {totalProducts} products
          </p>
        )}
      </div>

      {/* ── Floating cart badge ─────────────────────────────────────── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link
              to="/cart"
              className="flex items-center gap-3 bg-zinc-900 text-white pl-5 pr-4 py-3 rounded-2xl shadow-2xl shadow-zinc-900/40 hover:bg-amber-700 transition-colors duration-300 group"
            >
              <span className="text-lg">🛒</span>
              <span className="font-bold text-sm">
                {cartCount} item{cartCount > 1 ? "s" : ""}
              </span>
              <span className="ml-1 w-6 h-6 rounded-xl bg-amber-500 group-hover:bg-white group-hover:text-amber-700 text-white text-xs font-extrabold flex items-center justify-center transition-colors">
                →
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer { animation: shimmer 1.6s infinite linear; }
      `}</style>
    </div>
  );
}

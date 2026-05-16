import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { getProductBySlug } from "../services/productService";
import { addToCart } from "../../cart/services/cartService";
import useCartStore from "../../cart/store/cartStore";

// ── Mithila motif ─────────────────────────────────────────────────────────────
function MithilaMotif({ opacity = 0.06 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="mpd"
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
              transform="rotate(90 80 80)"
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
              transform="rotate(270 80 80)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mpd)" />
    </svg>
  );
}

// ── Image gallery with zoom ───────────────────────────────────────────────────
function ProductGallery({ image, name }) {
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Bihar Bites products typically have one image; slots ready for multi-image
  const images = [image].filter(Boolean);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <motion.div
          layoutId="product-img"
          onClick={() => setZoomed(true)}
          className="relative rounded-3xl overflow-hidden bg-amber-50 aspect-square cursor-zoom-in group border border-amber-100 shadow-lg"
        >
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50" />
          )}
          <img
            src={
              image ||
              "https://placehold.co/600x600/fef3c7/b45309?text=Bihar+Bites"
            }
            alt={name}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
          {/* Zoom hint */}
          <div
            className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-xl px-2.5 py-1 text-xs font-semibold text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            style={{ fontFamily: "sans-serif" }}
          >
            🔍 Click to zoom
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              src={image}
              alt={name}
              className="max-w-2xl w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition text-lg"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Qty stepper ───────────────────────────────────────────────────────────────
function QtyStepper({ value, onInc, onDec }) {
  return (
    <div className="flex items-center gap-0 rounded-2xl border border-amber-200 overflow-hidden bg-white shadow-sm w-fit">
      <button
        onClick={onDec}
        disabled={value <= 1}
        className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-xl"
      >
        −
      </button>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-12 text-center text-base font-extrabold text-zinc-900 tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <button
        onClick={onInc}
        className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:bg-amber-50 hover:text-amber-700 transition-colors font-bold text-xl"
      >
        +
      </button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="relative overflow-hidden bg-amber-950 pt-10 pb-14">
        <div className="max-w-7xl mx-auto px-5">
          <div className="h-3 w-48 bg-white/10 rounded animate-pulse mb-6" />
          <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
        </div>
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
      <div className="max-w-7xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl bg-amber-100 animate-pulse" />
        <div className="space-y-5">
          {[80, 50, 96, 40, 64, 40].map((w, i) => (
            <div
              key={i}
              className={`h-${i === 0 ? 10 : i === 2 ? 20 : 6} w-${w === 96 ? "full" : `${w}%`} bg-zinc-100 rounded-xl animate-pulse`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const syncFromCartResponse = useCartStore((s) => s.syncFromCartResponse);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const res = await addToCart({ productId: product.id, quantity });
      syncFromCartResponse(res);
      setAdded(true);
      toast.success(`${product.name} added to cart!`, {
        icon: "🛒",
        style: { borderRadius: "16px", background: "#1c1917", color: "#fff" },
      });
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to cart", {
        style: { borderRadius: "16px" },
      });
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data?.data)
    return (
      <div className="min-h-screen bg-amber-50/40 flex flex-col items-center justify-center text-center py-24 px-5">
        <div className="text-6xl mb-4">😕</div>
        <h2
          className="text-2xl font-bold text-zinc-900 mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Product not found
        </h2>
        <p
          className="text-zinc-500 text-sm mb-8"
          style={{ fontFamily: "sans-serif" }}
        >
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/products"
          className="rounded-2xl bg-amber-500 text-white px-8 py-3 font-bold hover:bg-amber-600 transition-colors"
          style={{ fontFamily: "sans-serif" }}
        >
          Browse Products
        </Link>
      </div>
    );

  const product = data.data;
  const totalPrice = (product.price * quantity).toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-amber-50/40">
      {/* ── Hero header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-amber-950 pt-10 pb-14">
        <MithilaMotif opacity={0.08} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#92400e66,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-5">
          <nav
            className="flex items-center gap-2 text-amber-300/60 text-xs mb-6 flex-wrap"
            aria-label="breadcrumb"
          >
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link
              to="/products"
              className="hover:text-amber-300 transition-colors"
            >
              Products
            </Link>
            {product.category?.name && (
              <>
                <span>›</span>
                <Link
                  to={`/products?category=${product.category.id}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-amber-300 truncate max-w-[160px]">
              {product.name}
            </span>
          </nav>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-2"
          >
            {product.category?.name || "Bihar Bites"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-3xl md:text-4xl font-extrabold text-white max-w-2xl leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {product.name}
          </motion.h1>
        </div>
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

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ── Image ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery image={product.image} name={product.name} />
          </motion.div>

          {/* ── Info panel ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="space-y-6"
          >
            {/* Price block */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-zinc-900">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <>
                  <span
                    className="text-xl text-zinc-400 line-through"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    ₹{product.originalPrice?.toLocaleString("en-IN")}
                  </span>
                  <span
                    className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Rating + stock */}
            <div
              className="flex items-center gap-3 flex-wrap"
              style={{ fontFamily: "sans-serif" }}
            >
              {product.rating && (
                <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold px-3 py-1.5 rounded-full">
                  ★ {product.rating}
                  {product.reviewCount && (
                    <span className="font-normal text-amber-600">
                      ({product.reviewCount})
                    </span>
                  )}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${product.inStock === false ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}
              >
                {product.inStock === false ? "Out of Stock" : "✓ In Stock"}
              </span>
              {product.weight && (
                <span className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full">
                  {product.weight}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-white border border-amber-100 p-5">
              <h3
                className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2"
                style={{ fontFamily: "sans-serif" }}
              >
                About this product
              </h3>
              <p
                className="text-zinc-600 leading-relaxed text-sm"
                style={{ fontFamily: "sans-serif" }}
              >
                {product.description ||
                  "A handpicked authentic Bihar delicacy, crafted with traditional recipes passed down through generations."}
              </p>
            </div>

            {/* Tags / highlights */}
            {product.tags?.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                style={{ fontFamily: "sans-serif" }}
              >
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-amber-100" />

            {/* Qty + Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p
                    className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    Quantity
                  </p>
                  <QtyStepper
                    value={quantity}
                    onInc={() => setQuantity((q) => q + 1)}
                    onDec={() => setQuantity((q) => Math.max(1, q - 1))}
                  />
                </div>
                {quantity > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5"
                  >
                    <p
                      className="text-xs text-zinc-500"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      Total
                    </p>
                    <p className="text-xl font-extrabold text-zinc-900">
                      ₹{totalPrice}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={adding || product.inStock === false}
                  className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm transition-all duration-300 shadow-lg ${
                    added
                      ? "bg-green-500 text-white shadow-green-200"
                      : product.inStock === false
                        ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                        : "bg-zinc-900 text-white hover:bg-amber-700 shadow-zinc-900/20"
                  }`}
                  style={{ fontFamily: "sans-serif" }}
                >
                  {adding ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                      Adding…
                    </>
                  ) : added ? (
                    <>✓ Added to Cart</>
                  ) : (
                    <>🛒 Add to Cart</>
                  )}
                </motion.button>

                <Link
                  to="/cart"
                  className="rounded-2xl border border-amber-300 text-amber-700 px-6 py-4 font-bold text-sm hover:bg-amber-50 transition-colors"
                  style={{ fontFamily: "sans-serif" }}
                >
                  View Cart
                </Link>
              </div>
            </div>

            {/* Delivery & trust info */}
            <div
              className="grid grid-cols-3 gap-3"
              style={{ fontFamily: "sans-serif" }}
            >
              {[
                {
                  icon: "🚚",
                  title: "Fast Delivery",
                  sub: "2–5 business days",
                },
                { icon: "🔒", title: "Secure Pay", sub: "100% safe checkout" },
                {
                  icon: "↩️",
                  title: "Easy Returns",
                  sub: "7-day return policy",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="flex flex-col items-center text-center gap-1.5 bg-white border border-amber-100 rounded-2xl py-3.5 px-2 hover:border-amber-200 transition-colors"
                >
                  <span className="text-xl">{b.icon}</span>
                  <p className="text-[11px] font-bold text-zinc-800 leading-tight">
                    {b.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    {b.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Category link */}
            {product.category && (
              <p
                className="text-xs text-zinc-400"
                style={{ fontFamily: "sans-serif" }}
              >
                Filed under{" "}
                <Link
                  to={`/products?category=${product.category.id}`}
                  className="text-amber-600 font-semibold hover:text-amber-800 transition-colors"
                >
                  {product.category.name}
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');
      `}</style>
    </div>
  );
}

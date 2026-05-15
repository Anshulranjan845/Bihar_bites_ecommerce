import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

import { logoutUser } from "../features/auth/services/authService";
import useAuthStore from "../features/auth/store/authStore";
import { getProducts } from "../features/products/services/productService";
import api from "../api/axios";

// ── Data ──────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "🌾",
    title: "Authentic Taste",
    text: "Handpicked regional snacks, sweets, and staples sourced from trusted makers across Bihar.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    text: "Quick packing and shipping workflows designed for freshness and reliability.",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    text: "Smooth, dependable order flow from discovery to payment confirmation.",
  },
];

const culturalHighlights = [
  { label: "Litti Chokha", emoji: "🔥", desc: "Bihar's soul food" },
  { label: "Thekua", emoji: "🍪", desc: "Festival favourite" },
  { label: "Sattu Drink", emoji: "🥤", desc: "Ancient superfood" },
  { label: "Khaja", emoji: "🍯", desc: "Silao's pride" },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "200+", label: "Authentic Products" },
  { value: "38", label: "Districts Sourced" },
  { value: "4.9★", label: "Average Rating" },
];

// ── Bihar SVG Motif (maithil art-inspired) ────────────────────────────────────
function MithilaMotifsBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="mithila"
          x="0"
          y="0"
          width="180"
          height="180"
          patternUnits="userSpaceOnUse"
        >
          {/* Peacock-inspired mandala */}
          <g opacity="0.07" fill="none" stroke="#b45309" strokeWidth="1.2">
            <circle cx="90" cy="90" r="60" />
            <circle cx="90" cy="90" r="40" />
            <circle cx="90" cy="90" r="20" />
            <line x1="90" y1="30" x2="90" y2="150" />
            <line x1="30" y1="90" x2="150" y2="90" />
            <line x1="47" y1="47" x2="133" y2="133" />
            <line x1="133" y1="47" x2="47" y2="133" />
            {/* Petals */}
            <ellipse cx="90" cy="55" rx="8" ry="18" />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(45 90 90)"
            />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(90 90 90)"
            />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(135 90 90)"
            />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(180 90 90)"
            />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(225 90 90)"
            />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(270 90 90)"
            />
            <ellipse
              cx="90"
              cy="55"
              rx="8"
              ry="18"
              transform="rotate(315 90 90)"
            />
            {/* Fish motif corners */}
            <ellipse
              cx="15"
              cy="15"
              rx="10"
              ry="6"
              transform="rotate(45 15 15)"
            />
            <ellipse
              cx="165"
              cy="15"
              rx="10"
              ry="6"
              transform="rotate(-45 165 15)"
            />
            <ellipse
              cx="15"
              cy="165"
              rx="10"
              ry="6"
              transform="rotate(-45 15 165)"
            />
            <ellipse
              cx="165"
              cy="165"
              rx="10"
              ry="6"
              transform="rotate(45 165 165)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mithila)" />
    </svg>
  );
}

// ── Lazy image with blur-up ───────────────────────────────────────────────────
function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-amber-100 animate-pulse" />
      )}
      <img
        src={
          src || "https://placehold.co/400x300/fef3c7/b45309?text=Bihar+Bites"
        }
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

// ── Product card with skeleton ────────────────────────────────────────────────
function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl overflow-hidden border border-amber-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden h-48">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">
          {product.category?.name}
        </p>
        <h3 className="font-bold text-zinc-900 line-clamp-1 font-display">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-extrabold text-zinc-900">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-zinc-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 text-center rounded-xl border border-amber-300 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
          >
            Details
          </Link>
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 text-center rounded-xl bg-zinc-900 text-white py-2 text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Product skeleton ──────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-100 bg-white animate-pulse">
      <div className="h-48 bg-amber-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-zinc-100 rounded" />
        <div className="h-4 w-2/3 bg-zinc-100 rounded" />
        <div className="h-3 w-full bg-zinc-100 rounded" />
        <div className="h-6 w-1/4 bg-zinc-100 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="h-9 flex-1 bg-zinc-100 rounded-xl" />
          <div className="h-9 flex-1 bg-zinc-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const loadHomeData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({ page: 1, limit: 8 }),
        api.get("/categories"),
      ]);
      setProducts(productsRes.products || productsRes.data || []);
      setCategories(categoriesRes?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category?.id === activeCategory)
    : products;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-amber-950"
      >
        {/* Parallax cultural background image */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-20"
            fetchpriority="high"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-amber-950/80 to-amber-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-transparent to-transparent" />
        </motion.div>

        {/* Mithila pattern overlay */}
        <div className="absolute inset-0 z-0">
          <MithilaMotifsBackground />
        </div>

        {/* Cultural badge strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex overflow-x-auto hide-scrollbar">
          {culturalHighlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-4 border-r border-white/10 last:border-0"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="text-white font-bold text-sm leading-none">
                  {item.label}
                </p>
                <p className="text-amber-300 text-xs mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 pt-20 pb-32 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span
                className="text-amber-300 text-sm font-medium tracking-wide"
                style={{ fontFamily: "sans-serif" }}
              >
                Bihar's Flavors · Delivered Nationwide
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white"
            >
              Taste the
              <br />
              <span className="text-amber-400">Soul of</span>
              <br />
              <span className="italic text-amber-200">Bihar</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-amber-100/80 text-lg max-w-lg leading-relaxed"
              style={{ fontFamily: "sans-serif" }}
            >
              From iconic litti chokha combos to handcrafted sweets and ancient
              grains — explore authentic Bihari flavours in one curated
              experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="group relative overflow-hidden rounded-2xl bg-amber-500 px-8 py-4 font-bold text-white text-base shadow-lg shadow-amber-900/40 hover:bg-amber-400 transition-all duration-300"
                style={{ fontFamily: "sans-serif" }}
              >
                <span className="relative z-10">Shop Now →</span>
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 font-semibold text-white hover:bg-white/20 transition-all duration-300"
                  style={{ fontFamily: "sans-serif" }}
                >
                  Create Account
                </Link>
              )}
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-amber-400 font-extrabold text-xl leading-none">
                    {s.value}
                  </p>
                  <p
                    className="text-amber-200/60 text-xs mt-1 leading-tight"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="rounded-2xl bg-white/8 backdrop-blur-md border border-white/10 p-5 flex gap-4 items-start hover:bg-white/12 transition-all"
              >
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-base">{f.title}</h3>
                  <p
                    className="text-amber-200/70 text-sm mt-1 leading-relaxed"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {f.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* User info box */}
            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl bg-amber-500/20 border border-amber-400/30 p-5"
                >
                  <p
                    className="text-amber-300 text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    Welcome back
                  </p>
                  <p className="font-bold text-white text-lg">{user.name}</p>
                  <p
                    className="text-amber-200/60 text-sm capitalize"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {user.role}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 transition-colors"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── CULTURE BANNER ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-amber-500 py-5">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...Array(3)].flatMap(() =>
            [
              "Litti Chokha",
              "Thekua",
              "Sattu Paratha",
              "Balushahi",
              "Makhana",
              "Khaja",
              "Silao Khaja",
              "Bihari Murabba",
            ].map((name) => (
              <span
                key={Math.random()}
                className="text-amber-950 font-bold text-sm tracking-widest uppercase flex items-center gap-4"
                style={{ fontFamily: "sans-serif" }}
              >
                {name} <span className="text-amber-700">◆</span>
              </span>
            )),
          )}
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────── */}
      <section className="relative bg-amber-50 py-20">
        <div className="absolute inset-0 opacity-[0.03]">
          <MithilaMotifsBackground />
        </div>
        <div className="relative max-w-7xl mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2"
                style={{ fontFamily: "sans-serif" }}
              >
                Browse by
              </p>
              <h2 className="text-4xl font-extrabold text-zinc-900">
                Categories
              </h2>
            </div>
            <Link
              to="/products"
              className="text-amber-700 font-semibold hover:text-amber-900 transition-colors"
              style={{ fontFamily: "sans-serif" }}
            >
              All Products →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.length > 0
              ? categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={`/products?category=${cat.id}`}
                      className="group block rounded-2xl bg-white border border-amber-100 p-5 hover:border-amber-400 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 group-hover:bg-amber-500 transition-colors flex items-center justify-center mb-3">
                        <span className="text-amber-600 group-hover:text-white text-lg transition-colors">
                          🛒
                        </span>
                      </div>
                      <p className="font-bold text-zinc-900">{cat.name}</p>
                      <p
                        className="text-xs text-zinc-500 mt-1"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        Explore {cat.name}
                      </p>
                    </Link>
                  </motion.div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-zinc-100 p-5 animate-pulse h-28"
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ── CULTURAL VISUAL BAND ─────────────────────────────────────── */}
      <section className="relative h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1600&q=80"
          alt="Bihar cultural heritage"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 to-amber-900/50 flex items-center">
          <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-8 items-center w-full">
            <div>
              <p
                className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3"
                style={{ fontFamily: "sans-serif" }}
              >
                Our Heritage
              </p>
              <h2 className="text-4xl font-extrabold text-white leading-tight">
                Rooted in
                <br />
                <span className="italic text-amber-300">3,000 years</span>
                <br />
                of tradition
              </h2>
            </div>
            <p
              className="text-amber-100/80 text-base leading-relaxed"
              style={{ fontFamily: "sans-serif" }}
            >
              Bihar — the land of the Buddha, Chanakya, and ancient Nalanda —
              has a culinary heritage as rich as its history. Every product we
              source tells a story of generations-old recipes, local wisdom, and
              Bihar's enduring spirit.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p
                className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2"
                style={{ fontFamily: "sans-serif" }}
              >
                Fresh Picks
              </p>
              <h2 className="text-4xl font-extrabold text-zinc-900">
                Latest Products
              </h2>
            </div>
            <Link
              to="/products"
              className="text-amber-700 font-semibold hover:text-amber-900 transition-colors"
              style={{ fontFamily: "sans-serif" }}
            >
              Browse All →
            </Link>
          </div>

          {/* Category filter pills */}
          {categories.length > 0 && (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 mb-8">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeCategory === null
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
                style={{ fontFamily: "sans-serif" }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                  style={{ fontFamily: "sans-serif" }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-block rounded-2xl bg-zinc-900 text-white px-10 py-4 font-bold hover:bg-amber-700 transition-colors duration-300"
              style={{ fontFamily: "sans-serif" }}
            >
              View Full Catalog
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── WHY BIHAR BITES ──────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <MithilaMotifsBackground />
        </div>
        <div className="relative max-w-7xl mx-auto px-5">
          <div className="text-center mb-14">
            <p
              className="text-amber-500 font-semibold text-sm uppercase tracking-widest mb-3"
              style={{ fontFamily: "sans-serif" }}
            >
              Why Choose Us
            </p>
            <h2 className="text-4xl font-extrabold text-white">
              The Bihar Bites Promise
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-white/8 bg-white/4 p-8 text-center hover:border-amber-500/40 hover:bg-white/6 transition-all duration-300 group"
              >
                <div className="text-5xl mb-5">{f.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
                <p
                  className="text-zinc-400 text-sm leading-relaxed"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-amber-500 py-20 text-center">
        <div className="absolute inset-0 opacity-10">
          <MithilaMotifsBackground />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto px-5"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-amber-950 mb-4">
            Ready to taste
            <br />
            <span className="italic">real Bihar?</span>
          </h2>
          <p
            className="text-amber-800 mb-8 text-lg leading-relaxed"
            style={{ fontFamily: "sans-serif" }}
          >
            Join 50,000+ customers who have discovered the authentic flavours of
            Bihar delivered to their doorstep.
          </p>
          <Link
            to="/products"
            className="inline-block rounded-2xl bg-amber-950 text-amber-50 px-10 py-4 font-bold text-base hover:bg-amber-900 transition-colors"
            style={{ fontFamily: "sans-serif" }}
          >
            Start Shopping →
          </Link>
        </motion.div>
      </section>

      {/* ── GLOBAL STYLES ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap');

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
    </div>
  );
}

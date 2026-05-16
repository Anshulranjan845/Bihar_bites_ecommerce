import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";
import useCartStore from "../store/cartStore";

// ── Mithila motif (brand-consistent) ─────────────────────────────────────────
function MithilaMotif() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="mp2"
          x="0"
          y="0"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <g opacity="0.06" fill="none" stroke="#b45309" strokeWidth="1.1">
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
      <rect width="100%" height="100%" fill="url(#mp2)" />
    </svg>
  );
}

// ── Lazy image ────────────────────────────────────────────────────────────────
function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-amber-50 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50" />
      )}
      <img
        src={src || "https://placehold.co/120x120/fef3c7/b45309?text=BB"}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

// ── Qty stepper ───────────────────────────────────────────────────────────────
function QtyStepper({ value, onIncrease, onDecrease, loading }) {
  return (
    <div className="flex items-center gap-0 rounded-xl border border-amber-200 overflow-hidden bg-white shadow-sm">
      <button
        onClick={onDecrease}
        disabled={loading || value <= 1}
        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold text-zinc-900 tabular-nums">
        {value}
      </span>
      <button
        onClick={onIncrease}
        disabled={loading}
        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg"
      >
        +
      </button>
    </div>
  );
}

// ── Cart item row ─────────────────────────────────────────────────────────────
function CartItem({ item, onRemove, onQtyChange }) {
  const [removing, setRemoving] = useState(false);
  const [qtyLoading, setQtyLoading] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.id);
  };

  const handleQty = async (delta) => {
    setQtyLoading(true);
    await onQtyChange(item.id, item.quantity + delta);
    setQtyLoading(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: removing ? 0 : 1,
        x: removing ? 60 : 0,
        height: removing ? 0 : "auto",
      }}
      exit={{ opacity: 0, x: 60, height: 0 }}
      transition={{ duration: 0.28 }}
      className="group bg-white border border-amber-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-amber-200 transition-all duration-300"
    >
      <div className="flex gap-0">
        {/* Product image */}
        <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
          <LazyImage
            src={item.product.image}
            alt={item.product.name}
            className="w-28 sm:w-36 h-28 sm:h-36 group-hover:scale-[1.02] transition-transform duration-300"
          />
        </Link>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5"
                style={{ fontFamily: "sans-serif" }}
              >
                {item.product.category?.name}
              </p>
              <Link to={`/products/${item.product.slug}`}>
                <h3
                  className="font-bold text-zinc-900 text-base leading-snug hover:text-amber-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {item.product.name}
                </h3>
              </Link>
              {item.product.weight && (
                <p
                  className="text-xs text-zinc-400 mt-0.5"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {item.product.weight}
                </p>
              )}
            </div>

            {/* Remove */}
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-40"
              aria-label="Remove item"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Bottom row: qty + price */}
          <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
            <QtyStepper
              value={item.quantity}
              onIncrease={() => handleQty(1)}
              onDecrease={() => handleQty(-1)}
              loading={qtyLoading}
            />
            <div className="text-right">
              <p className="text-xl font-extrabold text-zinc-900">
                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
              </p>
              {item.quantity > 1 && (
                <p
                  className="text-xs text-zinc-400"
                  style={{ fontFamily: "sans-serif" }}
                >
                  ₹{item.product.price.toLocaleString("en-IN")} ×{" "}
                  {item.quantity}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden flex animate-pulse">
      <div className="w-36 h-36 bg-amber-50 flex-shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <div className="h-3 w-1/4 bg-zinc-100 rounded" />
        <div className="h-5 w-2/3 bg-zinc-100 rounded" />
        <div className="h-3 w-1/3 bg-zinc-100 rounded" />
        <div className="flex justify-between mt-4">
          <div className="h-8 w-24 bg-zinc-100 rounded-xl" />
          <div className="h-6 w-20 bg-zinc-100 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Empty cart ────────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="text-7xl mb-6"
      >
        🛒
      </motion.div>
      <h2
        className="text-2xl font-bold text-zinc-900 mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Your cart is empty
      </h2>
      <p
        className="text-zinc-500 text-sm max-w-xs mb-8"
        style={{ fontFamily: "sans-serif" }}
      >
        Looks like you haven't added any authentic Bihar treats yet. Start
        exploring!
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 text-white px-8 py-3.5 font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
        style={{ fontFamily: "sans-serif" }}
      >
        Browse Products →
      </Link>
    </motion.div>
  );
}

// ── Order summary card ────────────────────────────────────────────────────────
function OrderSummary({ cartItems, subtotal }) {
  const delivery = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  return (
    <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden shadow-sm sticky top-24">
      {/* Header */}
      <div className="relative bg-amber-950 px-5 py-4 overflow-hidden">
        <MithilaMotif />
        <h2
          className="relative text-white font-bold text-lg"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Order Summary
        </h2>
        <p
          className="relative text-amber-300/70 text-xs mt-0.5"
          style={{ fontFamily: "sans-serif" }}
        >
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-5 space-y-3" style={{ fontFamily: "sans-serif" }}>
        {/* Line items */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="font-semibold text-zinc-900">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Delivery</span>
            {delivery === 0 ? (
              <span className="font-semibold text-green-600">FREE</span>
            ) : (
              <span className="font-semibold text-zinc-900">₹{delivery}</span>
            )}
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Tax (5% GST)</span>
            <span className="font-semibold text-zinc-900">₹{tax}</span>
          </div>
        </div>

        {/* Free delivery nudge */}
        {delivery > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
            <p className="text-xs text-amber-700 font-semibold">
              🎉 Add ₹{(499 - subtotal).toLocaleString("en-IN")} more for FREE
              delivery!
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-amber-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotal / 499) * 100, 100)}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>
        )}

        <div className="border-t border-zinc-100 pt-3 flex justify-between">
          <span className="font-bold text-zinc-900 text-base">Total</span>
          <div className="text-right">
            <span className="font-extrabold text-zinc-900 text-xl">
              ₹{total.toLocaleString("en-IN")}
            </span>
            <p className="text-[10px] text-zinc-400 mt-0.5">Incl. all taxes</p>
          </div>
        </div>

        {/* CTA */}
        <Link to="/checkout">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="mt-1 w-full bg-zinc-900 hover:bg-amber-700 text-white text-sm font-bold py-4 rounded-2xl text-center transition-colors duration-300 shadow-lg shadow-zinc-900/20 cursor-pointer"
          >
            Proceed to Checkout →
          </motion.div>
        </Link>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[
            { icon: "🔒", label: "Secure Pay" },
            { icon: "↩️", label: "Easy Return" },
            { icon: "✅", label: "Authentic" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-1 bg-zinc-50 rounded-xl py-2.5 px-1"
            >
              <span className="text-base">{b.icon}</span>
              <span className="text-[10px] font-semibold text-zinc-500 text-center leading-tight">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const cartItems = useCartStore((s) => s.cartItems);
  const setCart = useCartStore((s) => s.setCart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCart();
        setCart(res?.data?.cartItems || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load cart");
        setCart([]);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [setCart]);

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setCart(cartItems.filter((i) => i.id !== itemId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove item");
    }
  };

  const handleQtyChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, newQty);
      setCart(
        cartItems.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i,
        ),
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div
      className="min-h-screen bg-amber-50/40"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* ── Hero header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-amber-950 pt-10 pb-14">
        <MithilaMotif />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#92400e55,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-5">
          <nav
            className="flex items-center gap-2 text-amber-300/60 text-xs mb-6"
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
            <span>›</span>
            <span className="text-amber-300">Cart</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-amber-200/60 text-sm mt-2"
          >
            {loading
              ? "Loading…"
              : cartItems.length === 0
                ? "Nothing here yet"
                : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} · ₹${subtotal.toLocaleString("en-IN")} subtotal`}
          </motion.p>
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

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        {loading ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <CartSkeleton key={i} />
              ))}
            </div>
            <div className="hidden lg:block bg-white border border-zinc-100 rounded-2xl h-96 animate-pulse" />
          </div>
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* ── Cart items ─────────────────────────────────────── */}
            <div>
              {/* Quick clear */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-500">
                  {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                </p>
                <button
                  onClick={async () => {
                    if (!window.confirm("Clear your entire cart?")) return;
                    for (const item of cartItems) {
                      await removeCartItem(item.id).catch(() => {});
                    }
                    setCart([]);
                    toast.success("Cart cleared");
                  }}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors font-semibold"
                >
                  Clear all
                </button>
              </div>

              <AnimatePresence>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onQtyChange={handleQtyChange}
                    />
                  ))}
                </div>
              </AnimatePresence>

              {/* Continue shopping */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </motion.div>
            </div>

            {/* ── Summary ────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <OrderSummary cartItems={cartItems} subtotal={subtotal} />
            </motion.div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');
      `}</style>
    </div>
  );
}

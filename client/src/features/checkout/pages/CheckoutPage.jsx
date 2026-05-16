import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { load } from "@cashfreepayments/cashfree-js";

import { getCart } from "../../cart/services/cartService";
import api from "../../../api/axios";
import { createOrder, createPaymentOrder } from "../services/checkoutService";

const initialAddressForm = {
  fullName: "",
  phoneNumber: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
};

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
          id="mpc"
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
      <rect width="100%" height="100%" fill="url(#mpc)" />
    </svg>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Address", "Review", "Payment"];
  return (
    <div
      className="flex items-center gap-0 mb-8"
      style={{ fontFamily: "sans-serif" }}
    >
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                      : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap ${active ? "text-amber-700" : done ? "text-green-600" : "text-zinc-400"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${done ? "bg-green-400" : "bg-zinc-100"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Styled input ──────────────────────────────────────────────────────────────
function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      {label && (
        <label
          className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5"
          style={{ fontFamily: "sans-serif" }}
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-4 py-3 transition-all duration-200 ${
          focused
            ? "border-amber-400 ring-2 ring-amber-100 shadow-sm"
            : "border-zinc-200 hover:border-zinc-300"
        }`}
      >
        {icon && (
          <span className="text-zinc-400 text-base flex-shrink-0">{icon}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
          style={{ fontFamily: "sans-serif" }}
        />
      </div>
    </div>
  );
}

// ── Address card ──────────────────────────────────────────────────────────────
function AddressCard({ address, selected, onSelect }) {
  return (
    <motion.label
      whileTap={{ scale: 0.99 }}
      className={`block rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-amber-500 bg-amber-50/60 shadow-md shadow-amber-100"
          : "border-zinc-100 bg-white hover:border-amber-200 hover:shadow-sm"
      }`}
    >
      <input
        type="radio"
        name="address"
        value={address.id}
        checked={selected}
        onChange={() => onSelect(address.id)}
        className="sr-only"
      />
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            selected ? "border-amber-500 bg-amber-500" : "border-zinc-300"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className="font-bold text-zinc-900 text-sm"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {address.fullName}
            </p>
            {selected && (
              <span
                className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full"
                style={{ fontFamily: "sans-serif" }}
              >
                Selected
              </span>
            )}
          </div>
          <p
            className="text-xs text-zinc-500 mt-0.5 leading-relaxed"
            style={{ fontFamily: "sans-serif" }}
          >
            {address.addressLine}, {address.city}, {address.state} –{" "}
            {address.postalCode}
          </p>
          <p
            className="text-xs text-zinc-400 mt-1"
            style={{ fontFamily: "sans-serif" }}
          >
            📞 {address.phoneNumber}
          </p>
        </div>
      </div>
    </motion.label>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="relative overflow-hidden bg-amber-950 pt-10 pb-14">
        <div className="max-w-7xl mx-auto px-5">
          <div className="h-3 w-40 bg-white/10 rounded animate-pulse mb-6" />
          <div className="h-9 w-56 bg-white/10 rounded animate-pulse" />
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
      <div className="max-w-7xl mx-auto px-5 py-10 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="space-y-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-zinc-100 h-64 animate-pulse"
            />
          ))}
        </div>
        <div className="rounded-2xl bg-white border border-zinc-100 h-96 animate-pulse" />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(initialAddressForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartRes, addressRes] = await Promise.all([
          getCart(),
          api.get("/users/addresses"),
        ]);
        const cartItems = cartRes?.data?.cartItems || [];
        const savedAddresses = addressRes?.data?.data || [];
        setCart(cartItems);
        setAddresses(savedAddresses);
        if (savedAddresses.length > 0) setSelectedAddress(savedAddresses[0].id);
        else setShowAddForm(true);
        setStep(savedAddresses.length > 0 ? 2 : 1);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to load checkout data",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc + Number(item?.product?.price || 0) * Number(item?.quantity || 0),
        0,
      ),
    [cart],
  );
  const deliveryFee = subtotal > 999 ? 0 : 49;
  const platformFee = cart.length ? 5 : 0;
  const total = subtotal + deliveryFee + platformFee;

  const handleAddressInput = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setCreatingAddress(true);
    try {
      const res = await api.post("/users/addresses", addressForm);
      const created = res?.data?.data;
      if (!created) throw new Error("Address creation failed");
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddress(created.id);
      setAddressForm(initialAddressForm);
      setShowAddForm(false);
      setStep(2);
      toast.success("Address saved!", {
        icon: "📍",
        style: { borderRadius: "16px", background: "#1c1917", color: "#fff" },
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add address");
    } finally {
      setCreatingAddress(false);
    }
  };

  const handleCheckout = async () => {
    if (placingOrder) return;
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacingOrder(true);
    setStep(3);
    try {
      const orderRes = await createOrder({
        addressId: selectedAddress,
        paymentMethod: "CASHFREE",
      });
      const orderId = orderRes?.data?.id;
      if (!orderId) throw new Error("Order ID missing");

      const paymentRes = await createPaymentOrder(orderId);
      const paymentSessionId = paymentRes?.data?.payment_session_id;
      if (!paymentSessionId) throw new Error("Payment session ID missing");

      const cashfree = await load({ mode: "sandbox" });
      await cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to initiate payment",
      );
      setStep(2);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <CheckoutSkeleton />;

  const selectedAddr = addresses.find((a) => a.id === selectedAddress);

  return (
    <div className="min-h-screen bg-amber-50/40">
      {/* ── Hero header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-amber-950 pt-10 pb-14">
        <MithilaMotif opacity={0.08} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#92400e55,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-5">
          <nav
            className="flex items-center gap-2 text-amber-300/60 text-xs mb-6 flex-wrap"
            aria-label="breadcrumb"
          >
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link to="/cart" className="hover:text-amber-300 transition-colors">
              Cart
            </Link>
            <span>›</span>
            <span className="text-amber-300">Checkout</span>
          </nav>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-2"
          >
            Secure Checkout
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-4xl md:text-5xl font-extrabold text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Complete Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-amber-200/60 text-sm mt-2"
          >
            {cart.length} item{cart.length !== 1 ? "s" : ""} · ₹
            {total.toLocaleString("en-IN")} total
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
        <StepBar step={step} />

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* ── LEFT: Address ─────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Saved addresses */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-lg font-bold text-zinc-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  📍 Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddForm((v) => !v)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {showAddForm ? "✕ Cancel" : "+ Add New"}
                </button>
              </div>

              {/* Add address form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.form
                    onSubmit={handleAddAddress}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-5"
                  >
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
                      <p
                        className="text-xs font-bold text-amber-700 uppercase tracking-widest"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        New Address
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field
                          label="Full Name"
                          name="fullName"
                          value={addressForm.fullName}
                          onChange={handleAddressInput}
                          placeholder="Amit Kumar"
                          required
                          icon="👤"
                        />
                        <Field
                          label="Phone Number"
                          name="phoneNumber"
                          value={addressForm.phoneNumber}
                          onChange={handleAddressInput}
                          placeholder="9876543210"
                          type="tel"
                          required
                          icon="📞"
                        />
                      </div>
                      <Field
                        label="Address Line"
                        name="addressLine"
                        value={addressForm.addressLine}
                        onChange={handleAddressInput}
                        placeholder="House no, Street, Locality"
                        required
                        icon="🏠"
                      />
                      <div className="grid sm:grid-cols-3 gap-3">
                        <Field
                          label="City"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressInput}
                          placeholder="Patna"
                          required
                          icon="🏙️"
                        />
                        <Field
                          label="State"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressInput}
                          placeholder="Bihar"
                          required
                          icon="📌"
                        />
                        <Field
                          label="PIN Code"
                          name="postalCode"
                          value={addressForm.postalCode}
                          onChange={handleAddressInput}
                          placeholder="800001"
                          required
                          icon="🔢"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={creatingAddress}
                        className="flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-amber-700 text-white text-sm font-bold px-5 py-3 transition-colors disabled:opacity-50"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        {creatingAddress ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                            Saving…
                          </>
                        ) : (
                          "Save Address"
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Address list */}
              {addresses.length === 0 && !showAddForm ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📭</div>
                  <p
                    className="text-zinc-500 text-sm"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    No saved addresses. Add one above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      selected={selectedAddress === addr.id}
                      onSelect={(id) => {
                        setSelectedAddress(id);
                        setStep(2);
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Cart items summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm"
            >
              <h2
                className="text-lg font-bold text-zinc-900 mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                🛒 Items in Your Order
              </h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 border border-amber-100">
                      <img
                        src={
                          item.product.image ||
                          "https://placehold.co/48x48/fef3c7/b45309?text=BB"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-zinc-900 line-clamp-1"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {item.product.name}
                      </p>
                      <p
                        className="text-xs text-zinc-500"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p
                      className="text-sm font-bold text-zinc-900 flex-shrink-0"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      ₹
                      {(
                        Number(item.product.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Price summary + Pay ─────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
            className="sticky top-24 space-y-4"
          >
            {/* Price card */}
            <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden shadow-sm">
              {/* Card header */}
              <div className="relative bg-amber-950 px-5 py-4 overflow-hidden">
                <MithilaMotif opacity={0.1} />
                <h2
                  className="relative text-white font-bold text-lg"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Price Details
                </h2>
                <p
                  className="relative text-amber-300/70 text-xs mt-0.5"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div
                className="p-5 space-y-3"
                style={{ fontFamily: "sans-serif" }}
              >
                {/* Per-item rows */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm text-zinc-600"
                    >
                      <span className="line-clamp-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-zinc-800 flex-shrink-0">
                        ₹
                        {(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 pt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery</span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-zinc-900">
                        ₹{deliveryFee}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-zinc-900">
                      ₹{platformFee}
                    </span>
                  </div>
                </div>

                {/* Free delivery nudge */}
                {deliveryFee > 0 && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                    <p className="text-xs text-amber-700 font-semibold">
                      🎉 Add ₹{(999 - subtotal).toLocaleString("en-IN")} more
                      for FREE delivery!
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-amber-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((subtotal / 999) * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-zinc-100 pt-3 flex justify-between">
                  <span className="font-bold text-zinc-900 text-base">
                    Total Amount
                  </span>
                  <div className="text-right">
                    <span className="font-extrabold text-zinc-900 text-xl">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Incl. all taxes
                    </p>
                  </div>
                </div>

                {/* Selected address preview */}
                <AnimatePresence>
                  {selectedAddr && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-zinc-50 border border-zinc-100 p-3 overflow-hidden"
                    >
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Delivering to
                      </p>
                      <p className="text-xs font-bold text-zinc-800">
                        {selectedAddr.fullName}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        {selectedAddr.addressLine}, {selectedAddr.city} –{" "}
                        {selectedAddr.postalCode}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pay button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={
                    !selectedAddress || cart.length === 0 || placingOrder
                  }
                  className={`w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    placingOrder
                      ? "bg-amber-400 text-amber-900 cursor-wait"
                      : !selectedAddress || !cart.length
                        ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                        : "bg-amber-500 text-white hover:bg-amber-400 shadow-amber-200"
                  }`}
                  style={{ fontFamily: "sans-serif" }}
                >
                  {placingOrder ? (
                    <>
                      <span className="w-4 h-4 border-2 border-amber-700/40 border-t-amber-900 rounded-full animate-spin" />{" "}
                      Processing Payment…
                    </>
                  ) : (
                    <>
                      🔒 Proceed to Payment · ₹{total.toLocaleString("en-IN")}
                    </>
                  )}
                </motion.button>

                {/* Trust row */}
                <div
                  className="flex items-center justify-center gap-4 pt-1"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {[
                    "🔒 100% Secure",
                    "⚡ Instant Confirm",
                    "↩️ Easy Refund",
                  ].map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-zinc-400 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Payment logos */}
                <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                  {["Cashfree", "UPI", "Cards", "Netbanking"].map((m) => (
                    <span
                      key={m}
                      className="text-[10px] font-bold text-zinc-400 border border-zinc-200 px-2 py-1 rounded-lg bg-zinc-50"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');
      `}</style>
    </div>
  );
}

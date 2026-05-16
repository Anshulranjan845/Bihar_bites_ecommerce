import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

// ── Mithila motif ─────────────────────────────────────────────────────────────
function MithilaMotif({ opacity = 0.05 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="mps"
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
      <rect width="100%" height="100%" fill="url(#mps)" />
    </svg>
  );
}

// ── Verifying loader ──────────────────────────────────────────────────────────
function VerifyingState() {
  const steps = [
    "Contacting payment gateway…",
    "Verifying transaction…",
    "Confirming your order…",
  ];
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setStepIdx((i) => Math.min(i + 1, steps.length - 1)),
      1400,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50/40 relative overflow-hidden flex flex-col items-center justify-center px-5 py-16">
      <MithilaMotif opacity={0.04} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-100/60 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-sm"
      >
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-500"
          />
          <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center shadow-inner">
            <span className="text-2xl">🌾</span>
          </div>
        </div>

        <h2
          className="text-2xl font-extrabold text-zinc-900 mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Verifying Payment
        </h2>

        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIdx}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-zinc-500"
              style={{ fontFamily: "sans-serif" }}
            >
              {steps[stepIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-1.5 mt-5">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i === stepIdx ? 1 : 0.7,
                opacity: i <= stepIdx ? 1 : 0.3,
              }}
              className="w-2 h-2 rounded-full bg-amber-500"
            />
          ))}
        </div>
      </motion.div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');`}</style>
    </div>
  );
}

// ── Confetti burst (CSS-only, no library) ─────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    color: ["#f59e0b", "#10b981", "#3b82f6", "#f43f5e", "#8b5cf6", "#84cc16"][
      i % 6
    ],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.6,
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: p.rotate }}
          animate={{
            y: "110vh",
            x: (Math.random() - 0.5) * 120,
            opacity: [1, 1, 0],
            rotate: p.rotate + 360 * 2,
          }}
          transition={{
            duration: 2.8 + Math.random() * 1.2,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ── Success tick icon ─────────────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.08, 0.25] }}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-green-400"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="relative w-20 h-20 rounded-full bg-green-100 border-4 border-green-400 flex items-center justify-center shadow-lg shadow-green-200"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-10 h-10"
          fill="none"
          stroke="#16a34a"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M10 21 L17 28 L30 13"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Fail icon ─────────────────────────────────────────────────────────────────
function FailIcon() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-red-400"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="relative w-20 h-20 rounded-full bg-red-100 border-4 border-red-400 flex items-center justify-center shadow-lg shadow-red-200"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-10 h-10"
          fill="none"
          stroke="#dc2626"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <motion.line
            x1="12"
            y1="12"
            x2="28"
            y2="28"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.28, delay: 0.35 }}
          />
          <motion.line
            x1="28"
            y1="12"
            x2="12"
            y2="28"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.28, delay: 0.5 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Success content ───────────────────────────────────────────────────────────
function SuccessContent({ orderId }) {
  const steps = [
    { icon: "✅", label: "Order Confirmed" },
    { icon: "📦", label: "Being Packed" },
    { icon: "🚚", label: "Out for Delivery" },
    { icon: "🎉", label: "Delivered!" },
  ];

  return (
    <>
      <Confetti />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-green-100/50 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-green-100 rounded-3xl shadow-xl shadow-green-100/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />

          <div className="p-8 text-center">
            <SuccessIcon />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-[11px] font-bold text-green-600 uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "sans-serif" }}
            >
              Payment Confirmed
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
              className="text-3xl font-extrabold text-zinc-900 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Order Placed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto"
              style={{ fontFamily: "sans-serif" }}
            >
              Your authentic Bihar treats are confirmed. We're getting them
              ready for you!
            </motion.p>

            {/* Order ID */}
            {orderId && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.78 }}
                className="mt-4 inline-flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2.5"
              >
                <span
                  className="text-xs text-zinc-400"
                  style={{ fontFamily: "sans-serif" }}
                >
                  Order ID
                </span>
                <span className="text-xs font-bold text-zinc-800 font-mono">
                  {orderId}
                </span>
              </motion.div>
            )}

            {/* Order journey stepper */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-6 rounded-2xl bg-green-50 border border-green-100 p-4"
            >
              <p
                className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-4"
                style={{ fontFamily: "sans-serif" }}
              >
                Your Order Journey
              </p>
              <div className="flex items-start justify-between">
                {steps.map((s, i) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center gap-1.5 flex-1"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.9 + i * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base shadow-sm ${
                        i === 0
                          ? "bg-green-500 text-white shadow-green-200"
                          : "bg-white border border-zinc-200 text-zinc-400"
                      }`}
                    >
                      {s.icon}
                    </motion.div>
                    <span
                      className={`text-[9px] font-bold text-center leading-tight ${i === 0 ? "text-green-700" : "text-zinc-400"}`}
                      style={{ fontFamily: "sans-serif" }}
                    >
                      {s.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="absolute" /> // connector handled via flex
                    )}
                  </div>
                ))}
              </div>
              {/* Connecting line */}
              <div className="relative -mt-8 mb-6 mx-4 h-px bg-zinc-200 z-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "16.67%" }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="absolute left-0 top-0 h-full bg-green-400 rounded-full"
                />
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="mt-5 flex flex-col gap-3"
            >
              <Link
                to="/orders"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-white py-3.5 font-bold text-sm hover:bg-amber-700 transition-colors duration-300 shadow-lg shadow-zinc-900/20"
                style={{ fontFamily: "sans-serif" }}
              >
                📦 Track My Order
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors"
                  style={{ fontFamily: "sans-serif" }}
                >
                  🏠 Go Home
                </Link>
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-amber-200 text-amber-700 py-3 text-sm font-semibold hover:bg-amber-50 transition-colors"
                  style={{ fontFamily: "sans-serif" }}
                >
                  🛍️ Shop More
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 flex items-center justify-center gap-2">
            <span className="text-base">📧</span>
            <p
              className="text-xs text-zinc-500"
              style={{ fontFamily: "sans-serif" }}
            >
              A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-sm font-extrabold text-zinc-400 hover:text-amber-600 transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Bihar <span className="text-amber-500">Bites</span>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── Fail content ──────────────────────────────────────────────────────────────
function FailContent({ message }) {
  return (
    <>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-100/50 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-red-100 rounded-3xl shadow-xl shadow-red-100/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-400" />

          <div className="p-8 text-center">
            <FailIcon />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-[11px] font-bold text-red-500 uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "sans-serif" }}
            >
              Transaction Unsuccessful
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
              className="text-3xl font-extrabold text-zinc-900 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Payment Failed
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto"
              style={{ fontFamily: "sans-serif" }}
            >
              {message ||
                "Your payment could not be processed. Your cart is safe — no amount has been deducted."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex flex-col gap-3"
            >
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-white py-3.5 font-bold text-sm hover:bg-amber-700 transition-colors duration-300 shadow-lg shadow-zinc-900/20"
                style={{ fontFamily: "sans-serif" }}
              >
                🔄 Try Again
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors"
                  style={{ fontFamily: "sans-serif" }}
                >
                  🛒 View Cart
                </Link>
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-amber-200 text-amber-700 py-3 text-sm font-semibold hover:bg-amber-50 transition-colors"
                  style={{ fontFamily: "sans-serif" }}
                >
                  🛍️ Browse More
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 flex items-center justify-center gap-2">
            <span className="text-base">💬</span>
            <p
              className="text-xs text-zinc-500"
              style={{ fontFamily: "sans-serif" }}
            >
              Need help?{" "}
              <a
                href="mailto:support@biharbites.in"
                className="text-amber-700 font-semibold hover:text-amber-900 transition-colors"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-sm font-extrabold text-zinc-400 hover:text-amber-600 transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Bihar <span className="text-amber-500">Bites</span>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          setMessage("Invalid order reference.");
          return;
        }
        const res = await api.get(`/payments/verify/${orderId}`);
        if (res.data.success) {
          setPaymentSuccess(true);
          setMessage("Payment successful");
        } else {
          setPaymentSuccess(false);
          setMessage("Payment failed or was cancelled.");
        }
      } catch (err) {
        console.error(err);
        setPaymentSuccess(false);
        setMessage(
          err?.response?.data?.message || "Payment verification failed.",
        );
      } finally {
        setLoading(false);
      }
    };
    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-amber-50/40 relative overflow-hidden flex flex-col items-center justify-center px-5 py-16">
      <MithilaMotif opacity={0.04} />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="contents"
          >
            <VerifyingState />
          </motion.div>
        ) : paymentSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="contents"
          >
            <SuccessContent orderId={orderId} />
          </motion.div>
        ) : (
          <motion.div
            key="fail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="contents"
          >
            <FailContent message={message} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');`}</style>
    </div>
  );
}

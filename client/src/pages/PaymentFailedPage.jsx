import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
          id="mpf"
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
      <rect width="100%" height="100%" fill="url(#mpf)" />
    </svg>
  );
}

// ── Animated X icon ───────────────────────────────────────────────────────────
function FailIcon() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
      {/* Pulsing ring */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-red-400"
      />
      {/* Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="relative w-20 h-20 rounded-full bg-red-100 border-4 border-red-400 flex items-center justify-center shadow-lg shadow-red-200"
      >
        {/* X strokes */}
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
            transition={{ duration: 0.3, delay: 0.35 }}
          />
          <motion.line
            x1="28"
            y1="12"
            x2="12"
            y2="28"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

const reasons = [
  { icon: "💳", text: "Insufficient balance or card declined" },
  { icon: "🌐", text: "Network timeout during payment" },
  { icon: "⏱️", text: "Payment session expired" },
  { icon: "🔒", text: "Bank blocked the transaction" },
];

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-amber-50/40 relative overflow-hidden flex flex-col items-center justify-center px-5 py-16">
      <MithilaMotif opacity={0.04} />

      {/* Soft red glow blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-red-100/60 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main card */}
        <div className="bg-white border border-red-100 rounded-3xl shadow-xl shadow-red-100/60 overflow-hidden">
          {/* Top accent strip */}
          <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-400" />

          <div className="p-8 text-center">
            <FailIcon />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-[11px] font-bold text-red-500 uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "sans-serif" }}
            >
              Transaction Unsuccessful
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
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
              Your payment could not be processed. Your cart is safe — no amount
              has been deducted.
            </motion.p>

            {/* Possible reasons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-left space-y-2.5"
            >
              <p
                className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3"
                style={{ fontFamily: "sans-serif" }}
              >
                Possible Reasons
              </p>
              {reasons.map((r, i) => (
                <motion.div
                  key={r.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.07 }}
                  className="flex items-center gap-2.5"
                >
                  <span className="text-base flex-shrink-0">{r.icon}</span>
                  <span
                    className="text-xs text-zinc-600"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {r.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="mt-6 flex flex-col gap-3"
            >
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-white py-3.5 font-bold text-sm hover:bg-amber-700 transition-colors duration-300 shadow-lg shadow-zinc-900/20"
                style={{ fontFamily: "sans-serif" }}
              >
                🔄 Try Payment Again
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

          {/* Bottom help strip */}
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

        {/* Brand footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');
      `}</style>
    </div>
  );
}

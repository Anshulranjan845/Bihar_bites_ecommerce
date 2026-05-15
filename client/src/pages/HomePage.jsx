import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { logoutUser } from "../features/auth/services/authService";
import useAuthStore from "../features/auth/store/authStore";

const features = [
  { title: "Authentic Taste", text: "Handpicked regional snacks, sweets, and staples sourced from trusted makers across Bihar." },
  { title: "Fast Delivery", text: "Quick packing and shipping workflows designed for freshness and reliability." },
  { title: "Secure Checkout", text: "Smooth, dependable order flow from discovery to payment confirmation." },
];

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <section className="max-w-7xl mx-auto px-5 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-800">
              Bihar&apos;s flavors, delivered nationwide
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-zinc-900">
              Discover The Finest
              <span className="text-orange-600"> Bihar Bites</span>
            </h1>

            <p className="text-zinc-600 text-lg max-w-xl">
              From iconic litti chokha combos to handcrafted sweets and snacks,
              explore premium local favorites in one modern shopping experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="rounded-xl bg-zinc-900 text-white px-6 py-3 font-semibold hover:bg-zinc-700 transition">
                Shop Now
              </Link>

              {!user && (
                <Link to="/register" className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold hover:bg-zinc-100 transition">
                  Create Account
                </Link>
              )}
            </div>

            {user && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3 max-w-md">
                <p className="text-zinc-500 text-sm">Signed in as</p>
                <p className="font-bold text-lg text-zinc-900">{user.name}</p>
                <p className="text-zinc-600">Role: {user.role}</p>
                <button onClick={handleLogout} className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition">
                  Logout
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl bg-zinc-900 p-8 shadow-2xl">
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
                    className="rounded-2xl bg-white/95 p-5"
                  >
                    <h3 className="font-bold text-zinc-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-600">{feature.text}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

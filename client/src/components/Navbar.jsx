import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import useAuthStore from "../features/auth/store/authStore";
import useCartStore from "../features/cart/store/cartStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <header className="border-b border-zinc-200/80 sticky top-0 bg-white/90 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Bihar <span className="text-orange-600">Bites</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4 text-sm md:text-base flex-wrap justify-end">
          {[
            { to: "/", label: "Home" },
            { to: "/products", label: "Products" },
            { to: "/cart", label: `Cart (${cartItems.length})` },
          ].map((item) => (
            <motion.div key={item.to} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to={item.to} className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition">
                {item.label}
              </Link>
            </motion.div>
          ))}

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition">
                  Admin
                </Link>
              )}
              <span className="rounded-lg bg-orange-100 text-orange-800 px-3 py-2 font-medium">{user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-zinc-900 text-white px-3 py-2 hover:bg-zinc-700 transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

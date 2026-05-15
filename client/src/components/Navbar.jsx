import { Link } from "react-router-dom";

import useAuthStore from "../features/auth/store/authStore";

import useCartStore from "../features/cart/store/cartStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Bihar Bites
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/cart">Cart ({cartItems.length})</Link>

          {user ? (
            <>
              {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}

              <span>{user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

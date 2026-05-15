import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 py-10 grid gap-4 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xl font-bold text-zinc-900">Bihar Bites</p>
          <p className="text-zinc-600 text-sm">Traditional taste, modern shopping experience.</p>
        </div>
        <div className="md:text-right space-x-4 text-sm text-zinc-600">
          <Link to="/products" className="hover:text-zinc-900">Products</Link>
          <Link to="/cart" className="hover:text-zinc-900">Cart</Link>
          <Link to="/login" className="hover:text-zinc-900">Login</Link>
        </div>
      </div>
      <div className="border-t border-zinc-200 text-center text-xs text-zinc-500 py-4">
        © 2026 Bihar Bites. All rights reserved.
      </div>
    </footer>
  );
}

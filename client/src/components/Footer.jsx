import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#fffaf3] border-t border-amber-100 mt-20">
      <div className="max-w-7xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-4">
        {/* BRAND SECTION */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-extrabold text-zinc-900">
            Bihar <span className="text-amber-600">Bites</span>
          </h2>

          <p className="mt-3 text-zinc-600 text-sm leading-relaxed max-w-md">
            Bringing the authentic taste of Bihar directly to your home. Fresh,
            traditional, and crafted with love — now just a click away.
          </p>

          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
              🇮🇳 Made in India
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-zinc-100 text-zinc-700">
              Fresh Products
            </span>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-bold text-zinc-900 mb-4">Quick Links</h3>

          <div className="flex flex-col gap-2 text-sm text-zinc-600">
            <Link className="hover:text-amber-600 transition" to="/products">
              🛍️ Products
            </Link>
            <Link className="hover:text-amber-600 transition" to="/cart">
              🛒 Cart
            </Link>
            <Link className="hover:text-amber-600 transition" to="/orders">
              📦 Orders
            </Link>
            <Link className="hover:text-amber-600 transition" to="/login">
              🔐 Login
            </Link>
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-bold text-zinc-900 mb-4">Support</h3>

          <div className="flex flex-col gap-2 text-sm text-zinc-600">
            <p className="hover:text-amber-600 cursor-pointer">
              📞 +91 99999 99999
            </p>
            <p className="hover:text-amber-600 cursor-pointer">
              📧 support@biharbites.com
            </p>
            <p className="hover:text-amber-600 cursor-pointer">
              🚚 Shipping Info
            </p>
            <p className="hover:text-amber-600 cursor-pointer">
              🔁 Returns & Refunds
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>
            © 2026{" "}
            <span className="text-zinc-700 font-medium">Bihar Bites</span>. All
            rights reserved.
          </p>

          <div className="flex gap-4">
            <span className="hover:text-amber-600 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-amber-600 cursor-pointer">Terms</span>
            <span className="hover:text-amber-600 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

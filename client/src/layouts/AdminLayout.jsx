import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black text-white p-5">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <Link to="/admin" className="block">
            Dashboard
          </Link>

          <Link to="/admin/products" className="block">
            Products
          </Link>

          <Link to="/admin/categories" className="block">
            Categories
          </Link>

          <Link to="/admin/orders" className="block">
            Orders
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

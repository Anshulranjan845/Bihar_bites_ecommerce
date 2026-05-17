import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-72 bg-slate-950 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-8">Bihar Bites Admin</h2>
        <nav className="space-y-3 text-sm">
          <Link to="/" className="block text-slate-300 hover:text-white">← Back to Main Site</Link>
          <Link to="/admin" className="block hover:text-amber-300">Dashboard</Link>
          <Link to="/admin/products" className="block hover:text-amber-300">Inventory</Link>
          <Link to="/admin/products/create" className="block hover:text-amber-300">Add Product</Link>
          <Link to="/admin/categories" className="block hover:text-amber-300">Categories</Link>
          <Link to="/admin/orders" className="block hover:text-amber-300">Orders</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8"><Outlet /></main>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";

export default function AdminHomePage({ section }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [p, o, c] = await Promise.all([
        api.get("/products", { params: { limit: 200, includeUnavailable: true } }),
        api.get("/orders/admin/all"),
        api.get("/categories"),
      ]);
      setProducts(p.data.products || []);
      setOrders(o.data.data || []);
      setCategories(c.data.data || []);
    };
    load().catch(() => {});
  }, []);

  const revenue = useMemo(() => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [orders]);
  const ordersByStatus = useMemo(() => orders.reduce((a, o) => ({ ...a, [o.orderStatus]: (a[o.orderStatus] || 0) + 1 }), {}), [orders]);

  const downloadCsv = (rows, filename) => {
    const escapeCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (section === "orders") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <button
            onClick={() =>
              downloadCsv(
                [["OrderId", "User", "Email", "Amount", "Status"], ...orders.map((o) => [o.id, o.user?.name, o.user?.email, o.totalAmount, o.orderStatus])],
                "orders.csv",
              )
            }
            className="px-3 py-2 bg-emerald-600 text-white rounded"
          >
            Export CSV
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-5 shadow border border-slate-200">
              <div className="flex justify-between">
                <p className="font-semibold">{order.user?.name} ({order.user?.email})</p>
                <p className="font-bold">₹{order.totalAmount}</p>
              </div>

  if (section === "orders") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-5 shadow border border-slate-200">
              <div className="flex justify-between"><p className="font-semibold">{order.user?.name} ({order.user?.email})</p><p className="font-bold">₹{order.totalAmount}</p></div>
              <p className="text-sm text-slate-500">Status: {order.orderStatus} | Payment: {order.paymentStatus}</p>
              <p className="text-sm">Items: {order.orderItems?.map((i) => `${i.product?.name} x ${i.quantity}`).join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Advanced Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Products" value={products.length} />
        <Card title="Total Orders" value={orders.length} />
        <Card title="Categories" value={categories.length} />
        <Card title="Revenue" value={`₹${revenue.toFixed(2)}`} />
      </div>

      <div className="mt-8 bg-white rounded-xl p-5 border">
        <h3 className="font-semibold mb-3">Orders by Status</h3>
        <div className="space-y-2">
          {Object.entries(ordersByStatus).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between text-sm"><span>{status}</span><span>{count}</span></div>
              <div className="h-2 bg-slate-200 rounded">
                <div className="h-2 bg-orange-500 rounded" style={{ width: `${Math.max(8, (count / Math.max(1, orders.length)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return <div className="bg-white border border-slate-200 p-6 rounded-xl shadow"><h2 className="text-slate-500">{title}</h2><p className="text-3xl font-bold mt-2">{value}</p></div>;
}

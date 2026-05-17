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
    </div>
  );
}

function Card({ title, value }) {
  return <div className="bg-white border border-slate-200 p-6 rounded-xl shadow"><h2 className="text-slate-500">{title}</h2><p className="text-3xl font-bold mt-2">{value}</p></div>;
}

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Total Products</h2>

          <p className="text-3xl mt-3">0</p>
        </div>

        <div className="border p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Orders</h2>

          <p className="text-3xl mt-3">0</p>
        </div>

        <div className="border p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Revenue</h2>

          <p className="text-3xl mt-3">₹0</p>
        </div>
      </div>
    </div>
  );
}

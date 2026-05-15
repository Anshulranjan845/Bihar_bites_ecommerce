import { Link } from "react-router-dom";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Products</h1>

        <Link
          to="/admin/products/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>
    </div>
  );
}

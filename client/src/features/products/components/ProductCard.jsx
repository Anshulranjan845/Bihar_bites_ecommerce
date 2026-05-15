import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-gray-600">₹{product.price}</p>

        <Link
          to={`/products/${product.slug}`}
          className="inline-block bg-black text-white px-4 py-2 rounded"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { addToCart } from "../../cart/services/cartService";
import useCartStore from "../../cart/store/cartStore";

export default function ProductCard({ product }) {
  const syncFromCartResponse = useCartStore((state) => state.syncFromCartResponse);

  const handleQuickAdd = async () => {
    try {
      const response = await addToCart({ productId: product.id, quantity: 1 });
      syncFromCartResponse(response);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Please login to add items");
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
      <img
        src={product.image || "https://placehold.co/400x300?text=Bihar+Bites"}
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-4 space-y-2">
        <p className="text-xs text-zinc-500">{product.category?.name}</p>
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-gray-600 line-clamp-2 min-h-10">{product.description || "Authentic Bihar product."}</p>

        <p className="text-gray-900 font-bold">₹{product.price}</p>

        <div className="grid grid-cols-2 gap-2">
          <Link to={`/products/${product.slug}`} className="inline-block text-center border border-zinc-300 text-zinc-800 px-4 py-2 rounded hover:bg-zinc-100">
            Details
          </Link>
          <button onClick={handleQuickAdd} className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

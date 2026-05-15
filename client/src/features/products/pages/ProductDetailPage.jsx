import { useParams } from "react-router-dom";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getProductBySlug } from "../services/productService";
import { addToCart } from "../../cart/services/cartService";
import useCartStore from "../../cart/store/cartStore";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const [quantity, setQuantity] = useState(1);

  const syncFromCartResponse = useCartStore((state) => state.syncFromCartResponse);

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],

    queryFn: () => getProductBySlug(slug),
  });

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  const product = data.data;
  const handleAddToCart = async () => {
    try {
      const response = await addToCart({
        productId: product.id,

        quantity,
      });

      syncFromCartResponse(response);
      alert("Added to cart");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 grid md:grid-cols-2 gap-10">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded-xl"
      />

      <div className="space-y-5">
        <h1 className="text-4xl font-bold">{product.name}</h1>

        <p className="text-gray-600">{product.description}</p>

        <p className="text-2xl font-semibold">₹{product.price}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="border px-3 py-1"
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="border px-3 py-1"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import toast from "react-hot-toast";

import { getCart, removeCartItem } from "../services/cartService";

import useCartStore from "../store/cartStore";

import { Link } from "react-router-dom";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);

  const setCart = useCartStore((state) => state.setCart);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await getCart();
        setCart(response?.data?.cartItems || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load cart");
        setCart([]);
      }
    };

    loadCart();
  }, [setCart]);

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setCart(cartItems.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-5">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded flex justify-between"
          >
            <div>
              <h2>{item.product.name}</h2>

              <p>Qty: {item.quantity}</p>
            </div>

            <div>
              <p>₹{item.product.price}</p>

              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="text-2xl font-bold">Subtotal: ₹{subtotal}</div>

        <Link
          to="/checkout"
          className="inline-block mt-5 bg-black text-white px-6 py-3 rounded"
        >
          Proceed To Checkout
        </Link>
      </div>
    </div>
  );
}

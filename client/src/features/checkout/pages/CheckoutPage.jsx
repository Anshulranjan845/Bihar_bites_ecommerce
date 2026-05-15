import { useEffect, useState } from "react";

import { getCart } from "../../cart/services/cartService";

import api from "../../../api/axios";

import { createOrder } from "../services/checkoutService";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const cartRes = await getCart();

      setCart(cartRes.data.items);

      const addressRes = await api.get("/users/addresses");

      setAddresses(addressRes.data.data);
    };

    loadData();
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    try {
      const response = await createOrder({
        addressId: selectedAddress,

        paymentMethod: "CASHFREE",
      });

      window.location.href = response.paymentLink;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 grid md:grid-cols-2 gap-10">
      <div className="space-y-5">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <div>
          <h2 className="text-xl font-semibold mb-3">Select Address</h2>

          <div className="space-y-3">
            {addresses.map((address) => (
              <label key={address.id} className="border p-4 rounded block">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                />

                <span className="ml-3">
                  {address.fullName}, {address.city}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border p-6 rounded-xl h-fit">
        <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product.name} x {item.quantity}
              </span>

              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-5 pt-5 text-2xl font-bold">
          Total: ₹{subtotal}
        </div>

        <button
          onClick={handleCheckout}
          disabled={!selectedAddress}
          className="w-full mt-5 bg-black text-white py-3 rounded disabled:opacity-50"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

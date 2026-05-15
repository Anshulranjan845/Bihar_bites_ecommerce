import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getCart } from "../../cart/services/cartService";
import api from "../../../api/axios";

import { createOrder, createPaymentOrder } from "../services/checkoutService";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartRes, addressRes] = await Promise.all([
          getCart(),
          api.get("/users/addresses"),
        ]);

        setCart(cartRes?.data?.cartItems || []);
        setAddresses(addressRes?.data?.data || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load checkout data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc + Number(item?.product?.price || 0) * Number(item?.quantity || 0),
        0,
      ),
    [cart],
  );

  const deliveryFee = subtotal > 999 ? 0 : 49;
  const platformFee = cart.length ? 5 : 0;
  const total = subtotal + deliveryFee + platformFee;

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderResponse = await createOrder({
        addressId: selectedAddress,
        paymentMethod: "CASHFREE",
      });

      const orderId = orderResponse?.data?.id;

      if (!orderId) {
        throw new Error("Order was created but order id is missing");
      }

      const paymentResponse = await createPaymentOrder(orderId);

      const paymentLink = paymentResponse?.data?.payment_link;

      if (!paymentLink) {
        throw new Error("Payment link not received");
      }

      window.location.href = paymentLink;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to initiate payment",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-zinc-600">Loading checkout...</div>
    );
  }

  return (
    <section className="bg-zinc-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* HEADER */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
              Secure Checkout
            </h1>

            <p className="text-zinc-600 mt-2">
              Select your delivery address and review your order before payment.
            </p>
          </div>

          {/* ADDRESS SECTION */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

            <div className="space-y-3">
              {addresses.length === 0 && (
                <p className="text-zinc-600">No saved addresses found.</p>
              )}

              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block rounded-xl border p-4 cursor-pointer transition ${
                    selectedAddress === address.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  />

                  <span className="ml-3 text-zinc-800 font-medium">
                    {address.fullName}
                  </span>

                  <p className="ml-7 text-sm text-zinc-600">
                    {address.addressLine}, {address.city}, {address.state} -{" "}
                    {address.postalCode}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className="rounded-2xl bg-white border border-zinc-200 p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Price Details</h2>

          <div className="space-y-3 text-sm">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 text-zinc-700"
              >
                <span className="line-clamp-1">
                  {item.product.name} × {item.quantity}
                </span>

                <span className="font-medium">
                  ₹{Number(item.product.price) * item.quantity}
                </span>
              </div>
            ))}

            <div className="pt-3 border-t flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>

              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold text-zinc-900">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!selectedAddress || cart.length === 0 || placingOrder}
            className="w-full mt-6 rounded-xl bg-yellow-400 text-zinc-900 py-3 font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {placingOrder ? "Processing..." : "Proceed to Pay"}
          </button>
        </aside>
      </div>
    </section>
  );
}

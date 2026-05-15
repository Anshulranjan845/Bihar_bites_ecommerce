import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import api from "../api/axios";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get("order_id");

        if (!orderId) {
          setMessage("Invalid order");
          return;
        }

        const response = await api.get(`/payments/verify/${orderId}`);

        console.log("VERIFY RESPONSE:", response.data);

        if (response.data.success) {
          setPaymentSuccess(true);
          setMessage("Payment successful");
        } else {
          setPaymentSuccess(false);
          setMessage("Payment failed or cancelled");
        }
      } catch (error) {
        console.error(error);

        setPaymentSuccess(false);

        setMessage(
          error?.response?.data?.message || "Payment verification failed",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Verifying payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {paymentSuccess ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Payment Successful
            </h1>

            <p className="text-zinc-600 mb-6">
              Your order has been placed successfully.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Payment Failed
            </h1>

            <p className="text-zinc-600 mb-6">{message}</p>
          </>
        )}

        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
}

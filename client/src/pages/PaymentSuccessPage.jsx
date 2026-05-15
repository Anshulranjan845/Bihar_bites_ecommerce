import { Link } from "react-router-dom";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-5">
      <div className="max-w-lg w-full bg-white border border-green-200 rounded-3xl p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-green-700">Payment Successful 🎉</h1>
        <p className="mt-3 text-zinc-700">Your order has been placed successfully. We’ll start processing it right away.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/products" className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-700">Continue Shopping</Link>
          <Link to="/" className="px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100">Go Home</Link>
        </div>
      </div>
    </div>
  );
}

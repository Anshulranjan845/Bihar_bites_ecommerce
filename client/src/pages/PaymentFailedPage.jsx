import { Link } from "react-router-dom";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-5">
      <div className="max-w-lg w-full bg-white border border-red-200 rounded-3xl p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-red-700">Payment Failed</h1>
        <p className="mt-3 text-zinc-700">Your payment could not be completed. Please try checkout again.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/checkout" className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-700">Try Again</Link>
          <Link to="/cart" className="px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100">Back to Cart</Link>
        </div>
      </div>
    </div>
  );
}

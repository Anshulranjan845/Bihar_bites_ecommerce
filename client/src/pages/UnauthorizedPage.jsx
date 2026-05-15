import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-xl w-full rounded-3xl border border-amber-200 bg-amber-50/60 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-amber-700 uppercase">Access Restricted</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">You don’t have the required permissions</h1>
        <p className="mt-4 text-zinc-700">
          This admin section is only available to authorized admin accounts. If you think this is a mistake,
          please contact support.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="rounded-xl bg-zinc-900 px-5 py-2.5 text-white hover:bg-zinc-700 transition">
            Go to Home
          </Link>
          <Link to="/products" className="rounded-xl border border-zinc-300 px-5 py-2.5 text-zinc-800 hover:bg-zinc-100 transition">
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}

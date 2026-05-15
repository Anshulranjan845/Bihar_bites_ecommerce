import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { logoutUser } from "../features/auth/services/authService";
import useAuthStore from "../features/auth/store/authStore";
import { getProducts } from "../features/products/services/productService";
import api from "../api/axios";

const features = [
  { title: "Authentic Taste", text: "Handpicked regional snacks, sweets, and staples sourced from trusted makers across Bihar." },
  { title: "Fast Delivery", text: "Quick packing and shipping workflows designed for freshness and reliability." },
  { title: "Secure Checkout", text: "Smooth, dependable order flow from discovery to payment confirmation." },
];

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({ page: 1, limit: 8 }),
          api.get("/categories"),
        ]);

        setProducts(productsRes.products || []);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes?.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadHomeData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <section className="max-w-7xl mx-auto px-5 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <p className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-800">Bihar&apos;s flavors, delivered nationwide</p>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-zinc-900">Discover The Finest<span className="text-orange-600"> Bihar Bites</span></h1>

            <p className="text-zinc-600 text-lg max-w-xl">From iconic litti chokha combos to handcrafted sweets and snacks, explore premium local favorites in one modern shopping experience.</p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="rounded-xl bg-zinc-900 text-white px-6 py-3 font-semibold hover:bg-zinc-700 transition">Shop Now</Link>
              {!user && <Link to="/register" className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold hover:bg-zinc-100 transition">Create Account</Link>}
            </div>

            {user && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3 max-w-md">
                <p className="text-zinc-500 text-sm">Signed in as</p>
                <p className="font-bold text-lg text-zinc-900">{user.name}</p>
                <p className="text-zinc-600">Role: {user.role}</p>
                <button onClick={handleLogout} className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition">Logout</button>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <div className="rounded-3xl bg-zinc-900 p-8 shadow-2xl">
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.article key={feature.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }} className="rounded-2xl bg-white/95 p-5">
                    <h3 className="font-bold text-zinc-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-600">{feature.text}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Shop by Category</h2>
          <Link to="/products" className="text-orange-700 font-semibold">View All Products</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.id}`} className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-sm transition">
              <p className="font-semibold text-zinc-900">{category.name}</p>
              <p className="text-xs text-zinc-600 mt-1">Explore {category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Latest Products</h2>
          <Link to="/products" className="text-orange-700 font-semibold">Browse Catalog</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl overflow-hidden border border-zinc-200 bg-white hover:shadow-md transition">
              <img src={product.image || "https://placehold.co/400x300?text=Bihar+Bites"} alt={product.name} className="w-full h-44 object-cover" />
              <div className="p-4">
                <p className="text-sm text-zinc-500 mb-1">{product.category?.name}</p>
                <h3 className="font-semibold text-zinc-900 line-clamp-1">{product.name}</h3>
                <p className="text-lg font-bold text-zinc-900 mt-2">₹{product.price}</p>
                <div className="flex gap-2 mt-4">
                  <Link to={`/products/${product.slug}`} className="flex-1 text-center rounded-lg border border-zinc-300 py-2 text-sm hover:bg-zinc-100">Details</Link>
                  <Link to={`/products/${product.slug}`} className="flex-1 text-center rounded-lg bg-zinc-900 text-white py-2 text-sm hover:bg-zinc-700">Purchase</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

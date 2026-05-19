import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { googleAuth, loginUser } from "../services/authService";

import useAuthStore from "../store/authStore";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  const googleInitialized = useRef(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- GOOGLE INIT ----------------
  useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) {
      console.log("Google SDK missing");
      return;
    }

    // prevent multiple initialization
    if (googleInitialized.current) return;

    googleInitialized.current = true;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,

      callback: async (response) => {
        try {
          const res = await googleAuth(response.credential);

          setUser(res.data.user || res.data);

          toast.success("Google login successful 🎉");

          navigate("/");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Google login failed");
        }
      },
    });
  }, []);

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleAuth = () => {
    try {
      if (!window.google) {
        return toast.error("Google SDK not loaded");
      }

      window.google.accounts.id.prompt();
    } catch (error) {
      toast.error("Google auth failed");
    }
  };

  // ---------------- EMAIL LOGIN ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      setUser(response.data.user || response.data);

      toast.success("Login successful 🎉");

      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="relative overflow-hidden px-5 py-14 md:py-20">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),transparent_32%)]" />

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        {/* LEFT */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl font-black text-zinc-900 leading-tight">
            Authentic Bihari flavors, now just a login away.
          </h1>

          <p className="mt-4 text-zinc-600">
            Access your cart, reorder favorites, and explore products made with
            tradition.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-zinc-200 bg-white/90 backdrop-blur p-7 md:p-8 shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-zinc-900">Login</h2>

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 text-white p-3 font-semibold hover:bg-zinc-700 transition"
          >
            Login
          </button>

          {/* REGISTER */}
          <p className="text-sm text-zinc-600">
            New to Bihar Bites?{" "}
            <Link
              to="/register"
              className="text-orange-700 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full rounded-xl border border-zinc-300 p-3 font-semibold hover:bg-zinc-100 transition"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { googleAuth, registerUser } from "../services/authService";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function RegisterPage() {
  const navigate = useNavigate();

  const googleInitialized = useRef(false);

  const isDev = useMemo(() => import.meta.env.DEV, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
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

          toast.success("Google signup successful 🎉");

          navigate("/");
        } catch (error) {
          toast.error(error?.response?.data?.message || "Google signup failed");
        }
      },
    });
  }, []);

  // ---------------- GOOGLE AUTH ----------------
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

  // ---------------- REGISTER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      toast.success("Registered successfully 🎉");

      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="relative overflow-hidden px-5 py-14 md:py-20">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),transparent_36%),radial-gradient(circle_at_bottom,_rgba(251,191,36,0.2),transparent_40%)]" />

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
            Join the family
          </p>

          <h1 className="mt-3 text-4xl font-black text-zinc-900 leading-tight">
            Create your Bihar Bites account in seconds.
          </h1>

          <p className="mt-4 text-zinc-600">
            Get faster checkout, order tracking, and personalized
            recommendations inspired by regional taste.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-zinc-200 bg-white/90 backdrop-blur p-7 md:p-8 shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-zinc-900">Sign up</h2>

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

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

          {/* DEV ROLE */}
          {isDev && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Role (Development Only)
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="USER">User</option>

                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full rounded-xl bg-orange-600 text-white p-3 font-semibold hover:bg-orange-700 transition"
          >
            Create Account
          </button>

          {/* LOGIN LINK */}
          <p className="text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          {/* GOOGLE BUTTON */}
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

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import useAuthStore from "../features/auth/store/authStore";
import useCartStore from "../features/cart/store/cartStore";
import { logoutUser } from "../features/auth/services/authService";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
];

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cartItems = useCartStore((state) => state.cartItems) || [];

  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  const isHeroPage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  const isTransparent = isHeroPage && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent border-transparent"
            : "bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <motion.div
                whileHover={{
                  rotate: [0, -8, 8, 0],
                }}
                transition={{
                  duration: 0.4,
                }}
                className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-base shadow-md shadow-amber-200"
              >
                🌾
              </motion.div>

              <span
                className={`text-xl font-extrabold tracking-tight transition-colors duration-500 ${
                  isTransparent ? "text-shadow-zinc-700" : "text-zinc-900"
                }`}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                Bihar{" "}
                <span
                  className={
                    isTransparent ? "text-amber-400" : "text-amber-600"
                  }
                >
                  Bites
                </span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const active = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isTransparent
                        ? active
                          ? "text-amber-400"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                        : active
                          ? "text-amber-700 bg-amber-50"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    {item.label}

                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500"
                      />
                    )}
                  </Link>
                );
              })}

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">
              {/* CART */}
              <Link to="/cart" className="relative group">
                <motion.div
                  whileHover={{
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                    isTransparent
                      ? "text-white/90 hover:bg-white/10"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-lg">🛒</span>

                  <AnimatePresence mode="wait">
                    {cartItems.length > 0 && (
                      <motion.span
                        key={cartItems.length}
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                        exit={{
                          scale: 0,
                        }}
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow"
                      >
                        {cartItems.length > 99 ? "99+" : cartItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span className="hidden sm:inline">Cart</span>
                </motion.div>
              </Link>

              {/* USER */}
              {user ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <motion.button
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      isTransparent
                        ? "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                        : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>

                    {user?.name?.split(" ")[0]}

                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.97,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 8,
                          scale: 0.97,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-zinc-100 shadow-xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-zinc-100 bg-amber-50/60">
                          <p className="text-xs text-zinc-500">Signed in as</p>

                          <p className="font-bold text-zinc-900 text-sm truncate">
                            {user?.name}
                          </p>
                        </div>

                        <div className="py-1.5">
                          <Link
                            to="/orders"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                          >
                            📦 My Orders
                          </Link>

                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                          >
                            👤 Profile
                          </Link>
                        </div>

                        <div className="border-t border-zinc-100 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            🚪 Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      isTransparent
                        ? "text-white/90 hover:bg-white/10"
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      isTransparent
                        ? "bg-amber-500 text-white hover:bg-amber-400"
                        : "bg-zinc-900 text-white hover:bg-amber-700"
                    }`}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* MOBILE BUTTON */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={`md:hidden flex flex-col gap-1.5 p-2 rounded-xl transition-all ${
                  isTransparent ? "hover:bg-white/10" : "hover:bg-zinc-100"
                }`}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={
                      mobileOpen
                        ? i === 0
                          ? {
                              rotate: 45,
                              y: 8,
                            }
                          : i === 1
                            ? {
                                opacity: 0,
                              }
                            : {
                                rotate: -45,
                                y: -8,
                              }
                        : {
                            rotate: 0,
                            y: 0,
                            opacity: 1,
                          }
                    }
                    className={`block w-5 h-0.5 rounded-full ${
                      isTransparent ? "bg-zinc-600" : "bg-zinc-800"
                    }`}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-16" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');
      `}</style>
    </>
  );
}

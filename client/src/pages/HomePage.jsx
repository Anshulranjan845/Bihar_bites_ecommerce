import { logoutUser } from "../features/auth/services/authService";

import useAuthStore from "../features/auth/store/authStore";

import { Link } from "react-router-dom";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutUser();

      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 space-y-5">
      <h1 className="text-3xl font-bold">Bihar Bites Ecommerce</h1>

      {user ? (
        <div className="space-y-3">
          <p>Welcome, {user.name}</p>

          <p>Role: {user.role}</p>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Please login</p>
      )}

      <div className="pt-5">
        <Link to="/products" className="bg-black text-white px-4 py-2 rounded">
          Browse Products
        </Link>
      </div>
    </div>
  );
}

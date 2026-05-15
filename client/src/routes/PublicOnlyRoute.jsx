import { Navigate } from "react-router-dom";

import useAuthStore from "../features/auth/store/authStore";

export default function PublicOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="p-10 text-center text-zinc-600">Checking session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

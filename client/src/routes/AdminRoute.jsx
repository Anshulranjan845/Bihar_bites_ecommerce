import { Navigate } from "react-router-dom";

import useAuthStore from "../features/auth/store/authStore";

export default function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
}

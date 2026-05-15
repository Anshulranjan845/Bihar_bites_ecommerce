import { useEffect } from "react";
import useAuthStore from "../features/auth/store/authStore";
import { getProfile } from "../features/auth/services/authService";

export default function AuthInitializer({ children }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.data || res.data);
      } catch (error) {
        console.log("No active session");
      }
    };

    loadUser();
  }, [setUser]);

  return children;
}

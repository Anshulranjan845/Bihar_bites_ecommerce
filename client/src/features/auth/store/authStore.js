import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  isAuthenticated: false,

  isLoading: true,

  setUser: (user) =>
    set({
      user,

      isAuthenticated: true,

      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,

      isAuthenticated: false,

      isLoading: false,
    }),

  stopLoading: () =>
    set({
      isLoading: false,
    }),
}));

export default useAuthStore;

import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [],

  setCart: (items) =>
    set({
      cartItems: items || [],
    }),

  syncFromCartResponse: (cartResponse) =>
    set({
      cartItems: cartResponse?.data?.cartItems || [],
    }),
}));

export default useCartStore;

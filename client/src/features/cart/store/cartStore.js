import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [],

  setCart: (items) =>
    set({
      cartItems: items,
    }),
}));

export default useCartStore;

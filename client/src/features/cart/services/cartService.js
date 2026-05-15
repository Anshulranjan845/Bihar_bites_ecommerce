import api from "../../../api/axios";

export const addToCart = async (data) => {
  const response = await api.post("/cart", data);

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);

  return response.data;
};

import api from "../../../api/axios";

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);

  return response.data;
};

export const verifyPayment = async (orderId) => {
  const response = await api.get(`/payments/verify/${orderId}`);

  return response.data;
};

import api from "../../../api/axios";

export const createOrder = async (data) => {
  const response = await api.post("/orders/checkout", data);

  return response.data;
};

export const createPaymentOrder = async (orderId) => {
  const response = await api.post(`/payments/create-order`, { orderId });

  return response.data;
};

export const verifyPayment = async (orderId) => {
  const response = await api.post(`/payments/verify`, { orderId });

  return response.data;
};

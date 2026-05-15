import api from "../../../api/axios";

export const createProduct = async (data) => {
  const response = await api.post("/products", data);

  return response.data;
};

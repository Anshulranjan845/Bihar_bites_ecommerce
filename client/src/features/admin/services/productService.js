import api from "../../../api/axios.js";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (data, imageFile) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, String(data[key]));
  });

  if (imageFile) formData.append("image", imageFile);

  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

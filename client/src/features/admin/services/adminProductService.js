import api from "../../../api/axios";

export const createProduct = async (data, imageFile) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("slug", data.slug);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("stock", data.stock);
  formData.append("categoryId", data.categoryId);
  formData.append("isFeatured", data.isFeatured);
  formData.append("isAvailable", data.isAvailable);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

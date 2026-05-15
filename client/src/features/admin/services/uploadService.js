import api from "../../../api/axios";

export const uploadImage = async (file) => {
  const uploadData = new FormData();

  uploadData.append("image", file);

  const response = await api.post("/upload", uploadData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

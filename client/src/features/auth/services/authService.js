import api from "../../../api/axios";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};


export const googleAuth = async (idToken) => {
  const response = await api.post("/auth/google", { idToken });
  return response.data;
};

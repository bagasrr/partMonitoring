import axios from "axios";

export const getUsers = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/delete`);
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating user");
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating user");
  }
};

import axios from "axios";
import { handleApiError } from "./items";

export const getUsers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/delete`);
  } catch (error) {
    handleApiError(error);
  }
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error creating user");
    handleApiError(error);
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating user");
    handleApiError(error);
  }
};

import axios from "axios";
import { host } from "../features/AuthSlice";

export const getUsers = async () => {
  const response = await axios.get(`${host}/api/users`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`${host}/api/users/${id}`);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${host}/api/users/${id}`);
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(`${host}/api/users`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating user");
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.patch(`${host}/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating user");
  }
};

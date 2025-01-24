import axios from "axios";

export const getUsers = async () => {
  const response = await axios.get("http://localhost:4000/api/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`http://localhost:4000/api/users/${id}`);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`http://localhost:4000/api/users/${id}`);
};

export const createUser = async (data) => {
  try {
    const response = await axios.post("http://localhost:4000/api/users", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating user");
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating user");
  }
};

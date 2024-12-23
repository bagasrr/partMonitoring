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

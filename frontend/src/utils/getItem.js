import axios from "axios";

export const getAllItem = async () => {
  const response = await axios.get("http://localhost:4000/api/items");
  console.log(response.data);
  return response.data;
};

export const getItemById = async (id) => {
  const response = await axios.get(`http://localhost:4000/api/items/${id}`);
  return response.data;
};

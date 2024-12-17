import axios from "axios";

export const getAllItem = async () => {
  const response = await axios.get("http://localhost:4000/api/items");
  return response.data;
};

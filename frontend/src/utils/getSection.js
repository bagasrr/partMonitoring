import axios from "axios";

export const getSections = async () => {
  const response = await axios.get("http://localhost:4000/api/sections");
  return response.data;
};

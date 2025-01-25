import axios from "axios";

const host = "http://localhost:4000";
export const getSections = async () => {
  const response = await axios.get(`${host}/api/sections`);
  return response.data;
};

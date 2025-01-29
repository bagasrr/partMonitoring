import axios from "axios";
import { host } from "../features/authSlice";

export const getVendors = async () => {
  try {
    const response = await axios.get(`${host}/api/vendors`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching vendors");
  }
};

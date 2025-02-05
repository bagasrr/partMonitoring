import axios from "axios";

export const getHistories = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/history`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Histories");
  }
};

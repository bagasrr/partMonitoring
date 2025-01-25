import axios from "axios";

const host = "http://localhost:4000";
export const getItemUseHistories = async () => {
  try {
    const response = await axios.get(`${host}/api/item-use-histories`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Part");
  }
};

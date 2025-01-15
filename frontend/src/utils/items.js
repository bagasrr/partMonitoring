import axios from "axios";

// Create a new item
export const createItem = async (itemData) => {
  try {
    const response = await axios.post("http://localhost:4000/api/items", itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating item");
  }
};

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

// Fetch all items
export const getItems = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/items");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching items");
  }
};

// Update item status
export const updateItemStatus = async (itemId, statusData) => {
  try {
    const response = await axios.patch(`http://localhost:4000/api/items/${itemId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating item status");
  }
};

// Delete item
export const deleteItem = async (itemId) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting item");
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching item");
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axios.patch(`http://localhost:4000/api/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating item");
  }
};

export const changeItem = async (data) => {
  try {
    const response = await axios.patch("http://localhost:4000/api/items/change/swap", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error Changing item");
  }
};

import axios from "axios";

const host = "http://localhost:4000";
// Create a new item
export const createItem = async (itemData) => {
  try {
    const response = await axios.post(`${host}/api/items`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating item");
  }
};

// Fetch all items
export const getItems = async () => {
  try {
    const response = await axios.get(`${host}/api/items`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Part");
  }
};

// Update item status
export const updateItemStatus = async (itemId, statusData) => {
  try {
    const response = await axios.patch(`${host}/api/items/${itemId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating Part status");
  }
};

// Delete item
export const deleteItem = async (itemId) => {
  try {
    const response = await axios.delete(`${host}/api/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting Part");
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${host}/api/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Part");
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axios.patch(`${host}/api/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating Part");
  }
};

export const changeItem = async (data) => {
  try {
    const response = await axios.patch(`${host}/api/items/change/swap`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error Changing Part");
  }
};

export const getTypeSwapReplaceItem = async (query) => {
  try {
    const response = await axios.get(`${host}/api/items/type-swap/machine?machineName=${query}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error Fetching Part");
  }
};

export const getTypeSwapItem = async () => {
  try {
    const response = await axios.get(`${host}/api/items/type-swap`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error Fetching Part");
  }
};

export const getTypeReplaceitem = async () => {
  try {
    const response = await axios.get(`${host}/api/items/type-replace`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error Fetching Part");
  }
};

export const addItemAmount = async (data) => {
  try {
    const response = await axios.patch(`${host}/api/items/add-amount`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error while Add Amount");
  }
};

import axios from "axios";

// const host = import.meta.env.VITE_BACKEND_URL;
// Create a new item

export const handleApiError = (error) => {
  const statusCode = error.response?.status;

  if (statusCode === 500) {
    window.location.href = "/error500"; // Redirect ke halaman error 500
  }

  throw new Error(error.response?.data?.error || error.response?.data?.message || "Terjadi kesalahan pada API");
};

export const createItem = async (itemData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items`, itemData);
    return response.data;
  } catch (error) {
    // handleApiError(error);
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error creating item");
  }
};

// Fetch all items
export const getItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

export const getSpareItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/spare`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

export const getInUseItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/in-use`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

export const getRepairItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/repair`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

export const getBrokenItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/broken`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

// Update item status
export const updateItemStatus = async (itemId, statusData) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}/status`, statusData);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating Part status");
    handleApiError(error);
  }
};

// Delete item
export const deleteItem = async (id) => {
  try {
    console.log(id);
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/${id}/delete`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating Part status");
    handleApiError(error);
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating Part");
    // handleApiError(error);
  }
};

export const changeItem = async (data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/change/swap`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Changing Part");
    // handleApiError(error);
  }
};
export const replaceItem = async (data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/change/replace`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Changing Part");
    // handleApiError(error);
  }
};

export const getTypeSwapReplaceItem = async (query) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/type-swap/machine?machineName=${query}`);
    console.log(response);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Fetching Part");
    handleApiError(error);
  }
};

export const getTypeSwapItem = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/type-swap`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Fetching Part");
    handleApiError(error);
  }
};

export const getTypeReplaceitem = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/type-replace`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Fetching Part");
    handleApiError(error);
  }
};

export const addItemAmount = async (data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/add-amount`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error while Add Amount");
    // handleApiError(error);
  }
};

export const updateItemStatusForm = async (data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/items/status`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error while Add Amount");
    // handleApiError(error);
  }
};

export const getItemsBySection = async (sectionId, type) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${sectionId}/items-${type}`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

export const getItemType = async (type) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items/type-${type}`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Part");
    handleApiError(error);
  }
};

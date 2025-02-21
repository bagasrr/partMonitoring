import axios from "axios";

export const getVendors = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vendors`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching vendors");
    handleApiError(error);
  }
};

export const deleteVendor = async (uuid) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/${uuid}/delete`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error deleting vendor");
    handleApiError(error);
  }
};

export const createVendor = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    // throw new Error(error.response.data.error || error.response.data.message || "Error creating vendor");
    handleApiError(error);
  }
};

export const getVendorByID = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/${id}`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching vendor");
    handleApiError(error);
  }
};

export const updateVendor = async (uuid, data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/${uuid}/edit`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating vendor");
    handleApiError(error);
  }
};

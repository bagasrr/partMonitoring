import axios from "axios";

export const getVendors = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vendors`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching vendors");
  }
};

export const deleteVendor = async (uuid) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/${uuid}/delete`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error deleting vendor");
  }
};

export const createVendor = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vendors/`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.error || error.response.data.message || "Error creating vendor");
  }
};

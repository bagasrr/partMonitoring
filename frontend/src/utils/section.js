import axios from "axios";

export const getSections = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching sections");
  }
};

export const createSection = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sections`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error creating section");
  }
};

export const updateSection = async (id, data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating section");
  }
};

export const deleteSection = async (id) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Deleting Section");
  }
  return response.data;
};

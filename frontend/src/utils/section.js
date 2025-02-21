import axios from "axios";
import { handleApiError } from "./items";

export const getSections = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching sections");
    handleApiError(error);
  }
};

export const createSection = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sections`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error creating section");
    handleApiError(error);
  }
};

export const updateSection = async (id, data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating section");
    handleApiError(error);
  }
};

export const deleteSection = async (id) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}/delete`);
    return response;
  } catch (error) {
    console.log(error);
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Deleting Section");
    handleApiError(error);
  }
};

export const getSectionByID = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching section");
    handleApiError(error);
  }
};

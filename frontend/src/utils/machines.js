import axios from "axios";
import { handleApiError } from "./items";

export const getMachines = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/machines`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Machine");
    handleApiError(error);
  }
};

export const getMachineById = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/machines/${id}`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error fetching Machine by id");
    handleApiError(error);
  }
};

export const createMachines = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/machines`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error creating Machine");
    handleApiError(error);
  }
};

export const updateMachines = async (id, data) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/machines/${id}`, data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error updating Machine");
    handleApiError(error);
  }
};

export const deleteMachines = async (id) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/machines/${id}/delete`);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.error || error.response?.data?.message || "Error Deleting Machine");
    handleApiError(error);
  }
};

import axios from "axios";

export const getSections = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections`);
  return response.data;
};

export const createSection = async (data) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sections`, data);
  return response.data;
};

export const updateSection = async (id, data) => {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`, data);
  return response.data;
};

export const deleteSection = async (id) => {
  const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${id}`);
  return response.data;
};

import axios from "axios";
import { host } from "../features/AuthSlice";

export const getSections = async () => {
  const response = await axios.get(`${host}/api/sections`);
  return response.data;
};

export const createSection = async (data) => {
  const response = await axios.post(`${host}/api/sections`, data);
  return response.data;
};

export const updateSection = async (id, data) => {
  const response = await axios.patch(`${host}/api/sections/${id}`, data);
  return response.data;
};

export const deleteSection = async (id) => {
  const response = await axios.delete(`${host}/api/sections/${id}`);
  return response.data;
};

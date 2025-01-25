import axios from "axios";

const host = "http://localhost:4000";

export const getMachines = async () => {
  try {
    const response = await axios.get(`${host}/api/machines`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Machine");
  }
};

export const getMachineById = async (id) => {
  try {
    const response = await axios.get(`${host}/api/machines/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Machine by id");
  }
};

export const createMachines = async (data) => {
  try {
    const response = await axios.post(`${host}/api/machines`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating Machine");
  }
};

export const updateMachines = async (id, data) => {
  try {
    const response = await axios.patch(`${host}/api/machines/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating Machine");
  }
};

import axios from "axios";

export const getMachines = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/machines");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Machine");
  }
};

export const getMachineById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/machines/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching Machine by id");
  }
};

export const createMachines = async (data) => {
  try {
    const response = await axios.post("http://localhost:4000/api/machines", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating Machine");
  }
};

export const updateMachines = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/api/machines/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating Machine");
  }
};

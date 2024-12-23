export const getMachines = async () => {
  const response = await axios.get("http://localhost:4000/api/machines");
  return response.data;
};

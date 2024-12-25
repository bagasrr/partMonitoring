import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Layout from "./Layout";

const ChangePartForm = () => {
  const [items, setItems] = useState([]);
  const [machines, setMachines] = useState([]);
  const [itemId, setItemId] = useState("");
  const [machineId, setMachineId] = useState("");
  const [changeType, setChangeType] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchItemsAndMachines = async () => {
      try {
        const itemsResponse = await axios.get("http://localhost:4000/api/items");
        setItems(itemsResponse.data);

        const machinesResponse = await axios.get("http://localhost:4000/api/machines");
        setMachines(machinesResponse.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchItemsAndMachines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/history", {
        itemId,
        machineId,
        userId: user.id,
        changeType,
        description,
      });
      console.log(itemId, machineId, user.id, changeType, description);
      alert("History created successfully");
    } catch (error) {
      console.error(error.message);
    }
  };
  console.log(items);
  return (
    <Layout>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Change Part</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemId">
            Item
          </label>
          <select
            id="itemId"
            value={itemId}
            onChange={(e) => {
              console.log(e.target.value);
              setItemId(e.target.value);
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select Item
            </option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="machineId">
            Machine
          </label>
          <select
            id="machineId"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select Machine
            </option>
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.machine_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="changeType">
            Change Type
          </label>
          <select
            id="changeType"
            value={changeType}
            onChange={(e) => setChangeType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select Change Type
            </option>
            <option value="Addition">Addition</option>
            <option value="Replacement">Replacement</option>
            <option value="Repair">Repair</option>
            <option value="Removal">Removal</option>
            <option value="Inspection">Inspection</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default ChangePartForm;

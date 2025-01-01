import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Layout from "./Layout";
import { NormalInput } from "../element/Input";
import { useNavigate } from "react-router-dom";

const ChangePartForm = () => {
  const [items, setItems] = useState([]);
  const [machines, setMachines] = useState([]);
  const [usedStock, setUsedStock] = useState("");
  const [itemName, setItemName] = useState("");
  const [changeType, setChangeType] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
        itemName,
        usedStock,
        userId: user.id,
        changeType,
        description,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Change Part</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemId">
            Nama Part
          </label>
          <select
            id="itemName"
            value={itemName}
            onChange={(e) => {
              console.log(e.target.value);
              setItemName(e.target.value);
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select Part
            </option>
            {items.map((item) => (
              <option key={item.uuid} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <NormalInput label="Stok terpakai" type="number" id="usedStock" onChange={(e) => setUsedStock(e.target.value)} placeholder={"Masukkan stok terpakai"} />
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
            <option value="Replacement">Penggantian</option>
            <option value="Repair">Perbaikan</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Masukkan Deskripsi"
            maxLength={500}
            rows={4}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default ChangePartForm;

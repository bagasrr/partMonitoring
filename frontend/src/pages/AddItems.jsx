import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getAllItem } from "../utils/getItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setNotification } from "../features/notificationSlice";

const AddItem = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [names, setNames] = useState([]);
  const [isNewName, setIsNewName] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    const items = await getAllItem();
    const itemNames = items.map((item) => item.name);
    setNames(itemNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/items", {
      name: name,
      stok: parseInt(stock),
    });
    dispatch(setNotification("Items Added"));
    navigate("/items");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Add Item</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Item Name
            </label>
            <select
              id="name"
              value={isNewName ? "new" : name}
              onChange={(e) => {
                if (e.target.value === "new") {
                  setIsNewName(true);
                  setName("");
                } else {
                  setIsNewName(false);
                  setName(e.target.value);
                }
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" disabled>
                Select or enter a name
              </option>
              {names.map((itemName, index) => (
                <option key={index} value={itemName}>
                  {itemName}
                </option>
              ))}
              <option value="new">Enter a new name</option>
            </select>
            {isNewName && (
              <input
                type="text"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value ? parseInt(e.target.value) : "")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter stock quantity"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Item
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddItem;
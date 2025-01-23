import { getItems } from "../../utils/items";
import FormField from "../FormField";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangeItemForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedReplaceItem, setSelectedReplaceItem] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    replaceItemName: "",
    itemStartUseDate: "",
    itemEndUseDate: "",
    machineName: "",
    reason: "",
    itemYear: "",
    replaceItemYear: "",
    itemStatus: "",
    useAmount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (e) => {
    const [name, year] = e.target.value.split(" - ");
    const item = items.find((item) => item.name === name && item.year.toString() === year);
    if (item) {
      setSelectedItem(item);
      setFormData({
        ...formData,
        itemName: item.name,
        itemYear: item.year,
      });
      console.log("Item selected: ", item); // Add this line
    } else {
      setSelectedItem(null);
      setFormData({
        ...formData,
        itemName: "",
        itemYear: "",
      });
    }
  };

  // const handleReplaceItemChange = (e) => {
  //   const [name, year] = e.target.value.split(" - ");
  //   const replaceItem = items.find((item) => item.name === name && item.year.toString() === year);
  //   if (replaceItem) {
  //     setSelectedReplaceItem(replaceItem);
  //     setFormData({ ...formData, replaceItemName: replaceItem.name, replaceItemYear: replaceItem.year, machineName: replaceItem.machine.machine_name });
  //     console.log("Replace item selected: ", replaceItem); // Add this line
  //   } else {
  //     setSelectedReplaceItem(null);
  //     setFormData({ ...formData, replaceItemName: "", replaceItemYear: "" });
  //   }
  // };

  const handleReplaceItemChange = (e) => {
    const value = e.target.value;
    if (value === "NA") {
      setSelectedReplaceItem(null);
      setFormData({ ...formData, replaceItemName: "NA", replaceItemYear: "", machineName: "" });
    } else {
      const [name, year] = value.split(" - ");
      const replaceItem = items.find((item) => item.name === name && item.year.toString() === year);
      if (replaceItem) {
        setSelectedReplaceItem(replaceItem);
        setFormData({ ...formData, replaceItemName: replaceItem.name, replaceItemYear: replaceItem.year, machineName: replaceItem.machine.machine_name });
        console.log("Replace item selected: ", replaceItem); // Add this line
      } else {
        setSelectedReplaceItem(null);
        setFormData({ ...formData, replaceItemName: "", replaceItemYear: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("http://localhost:4000/api/items/change", formData);
      console.log(formData);
      navigate("/items");
      // alert("Item updated successfully");
    } catch (error) {
      console.error(error);
      alert("Error updating item");
    }
  };

  const fetchItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700">Part yang ingin diganti:</label>
        <select name="itemName" value={formData.itemName ? `${formData.itemName} - ${formData.itemYear}` : ""} onChange={handleItemChange} className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Item
          </option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Tahun:</label>
        <input type="number" name="itemYear" value={formData.itemYear} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Status Part Sekarang:</label>
        <select type="text" name="itemStatus" value={formData.itemStatus} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Status
          </option>
          <option value="Spare">Spare</option>
          <option value="Broken">Broken</option>
          <option value="Repair">Repair</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Item Start Use Date:</label>
        <input type="date" name="itemStartUseDate" value={formData.itemStartUseDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Item End Use Date:</label>
        <input type="date" name="itemEndUseDate" value={formData.itemEndUseDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Alasan Penggantian:</label>
        <input type="text" name="reason" value={formData.reason} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      {/* <div className="mb-4">
        <label className="block text-gray-700">Part Pengganti:</label>
        <select name="replaceItemName" value={formData.replaceItemName ? `${formData.replaceItemName} - ${formData.replaceItemYear}` : ""} onChange={handleReplaceItemChange} className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Replace Item
          </option>
          <option value="NA">NA</option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </select>
      </div> */}

      <div className="mb-4">
        <label className="block text-gray-700">Part Pengganti:</label>
        <select name="replaceItemName" value={formData.replaceItemName ? `${formData.replaceItemName} - ${formData.replaceItemYear}` : ""} onChange={handleReplaceItemChange} className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Replace Item
          </option>
          <option value="NA">NA</option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Tahun Part Pengganti:</label>
        <input type="number" name="replaceItemYear" value={formData.replaceItemYear} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Machine Name:</label>
        <input type="text" name="machineName" value={formData.machineName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      {selectedItem && selectedItem.replacementType === "Replace" && (
        <div className="mb-4">
          <label className="block text-gray-700">Use Amount:</label>
          <input type="number" name="useAmount" value={formData.useAmount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        </div>
      )}

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Ganti Part
      </button>
    </form>
  );
};

export default ChangeItemForm;

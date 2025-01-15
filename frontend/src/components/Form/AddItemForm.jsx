import React, { useState } from "react";
import { createItem } from "../../utils/items";
import FormField from "../FormField";
import { useNavigate } from "react-router-dom";

const AddItemForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    status: "Not Set",
    lowerLimit: 0,
    machine_name: "",
    machine_number: "",
    section_name: "",
    section_number: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate numerical inputs
    if (name === "amount" || name === "lowerLimit") {
      if (value < 0) {
        setErrors({ ...errors, [name]: "Nilai Harus lebih dari 0" });
      } else {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data before submitting
    const newErrors = {};
    if (formData.amount < 0) {
      newErrors.amount = "Nilai harus lebih dari 0";
    }
    if (formData.lowerLimit < 0) {
      newErrors.lowerLimit = "Nilai harus lebih dari 0";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const data = await createItem(formData);
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      setFormData({
        name: "",
        amount: "",
        description: "",
        status: "Not Set",
        lowerLimit: 0,
        machine_name: "",
        machine_number: "",
        section_name: "",
        section_number: "",
      });
      navigate("/items");
      setNotification("Item created successfully!");
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
  };

  return (
    <div>
      {notification && <div className="mb-4 p-2 text-white bg-green-500 rounded">{notification}</div>}
      <form onSubmit={handleSubmit}>
        <FormField label="Name" name="name" value={formData.name} onChange={handleChange} />
        <FormField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} />
        <FormField label="Description" name="description" value={formData.description} onChange={handleChange} />
        <FormField label="Status" name="status" type="select" value={formData.status} onChange={handleChange}>
          <option value="Not Set">Not Set</option>
          <option value="Siap Pakai">Siap Pakai</option>
          <option value="Repair">Repair</option>
          <option value="Rusak">Rusak</option>
        </FormField>
        <FormField label="Lower Limit" name="lowerLimit" type="number" value={formData.lowerLimit} onChange={handleChange} error={errors.lowerLimit} />
        <FormField label="Machine Name" name="machine_name" value={formData.machine_name} onChange={handleChange} />
        <FormField label="Machine Number" name="machine_number" value={formData.machine_number} onChange={handleChange} />
        <FormField label="Section Name" name="section_name" value={formData.section_name} onChange={handleChange} />
        <FormField label="Section Number" name="section_number" value={formData.section_number} onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;

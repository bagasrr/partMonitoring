import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById, updateItem } from "../../utils/items";
import FormField from "../FormField";

const EditItemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    status: "Not Set",
    lowerLimit: 0,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const data = await getItemById(id);
      console.log(data);

      setFormData({
        ...data,
        machine_name: data.machine?.machine_name || "",
        machine_number: data.machine?.machine_number || "",
      });
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate numerical inputs
    if (name === "amount" || name === "lowerLimit") {
      if (value < 0) {
        setErrors({ ...errors, [name]: "Value must be greater than or equal to 0" });
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
      newErrors.amount = "Value must be greater than or equal to 0";
    }
    if (formData.lowerLimit < 0) {
      newErrors.lowerLimit = "Value must be greater than or equal to 0";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await updateItem(id, formData);
      setNotification("Item updated successfully!");
      setTimeout(() => {
        setNotification("");
        navigate("/items");
      }, 3000);
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000);
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
          <option value="Not Set" disabled>
            Not Set
          </option>
          <option value="Siap Pakai">Siap Pakai</option>
          <option value="Rusak">Rusak</option>
          <option value="Perbaikan">Perbaikan</option>
        </FormField>
        <FormField label="Lower Limit" name="lowerLimit" type="number" value={formData.lowerLimit} onChange={handleChange} error={errors.lowerLimit} />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditItemForm;

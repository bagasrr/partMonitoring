import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById, updateItem } from "../../utils/items";
import FormField from "../FormField";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../features/notificationSlice";

const EditItemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    year: "",
    replacementType: "",
    status: "Not Set",
    lowerLimit: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [notif, setNotif] = useState("");

  const dispatch = useDispatch();

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
      setNotif(error.message);
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
      dispatch(setNotification(`Item ${formData.name} Updated`));
      navigate("/items");
    } catch (error) {
      setNotif(error.message);
    }
  };

  return (
    <div>
      {notif && <div className="mt-4 p-2 text-white bg-red-500 rounded">{notif}</div>}
      <form onSubmit={handleSubmit}>
        <FormField label="Name" name="name" value={formData.name || ""} onChange={handleChange} />
        <FormField label="Amount" name="amount" type="number" value={formData.amount || ""} onChange={handleChange} error={errors.amount} />
        <FormField label="Description" name="description" value={formData.description || ""} onChange={handleChange} />
        <FormField label="Year" name="year" value={formData.year || ""} onChange={handleChange} />
        <FormField label="Replacement Type" name="replacementType" type="select" value={formData.replacementType || ""} onChange={handleChange}>
          <option value="" disabled>
            Pilih tipe penggantian
          </option>
          <option value="Swap">Swap</option>
          <option value="Replace">Replace</option>
        </FormField>
        <FormField label="Status" name="status" type="select" value={formData.status || ""} onChange={handleChange}>
          <option value="Not Set" disabled>
            Not Set
          </option>
          <option value="In Use">In Use</option>
          <option value="Broken">Broken</option>
          <option value="Repair">Repair</option>
          <option value="Spare">Spare</option>
        </FormField>
        <FormField label="Lower Limit" name="lowerLimit" type="number" value={formData.lowerLimit || ""} onChange={handleChange} error={errors.lowerLimit} placeholder={"masukkan batas bawah"} />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          Save
        </button>
        {notif && <div className={`mt-4 p-2 text-white ${notif ? "bg-red-500" : "bg-green-500"} rounded`}>{notif}</div>}
      </form>
    </div>
  );
};

export default EditItemForm;

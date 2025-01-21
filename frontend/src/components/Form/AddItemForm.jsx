import React, { useEffect, useState } from "react";
import { createItem } from "../../utils/items";
import FormField from "../FormField";
import { useNavigate } from "react-router-dom";
import { getMachines } from "../../utils/getMachine";
import { getSections } from "../../utils/getSection";

const AddItemForm = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [sections, setSections] = useState([]);
  const [isNewMachine, setIsNewMachine] = useState(false);
  const [isNewSection, setIsNewSection] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    description: "",
    status: "Not Set",
    lowerLimit: 0,
    machine_name: "",
    machine_number: "",
    section_name: "",
    section_number: "",
    replacementType: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert amount and lowerLimit to numbers
    const newValue = name === "amount" || name === "lowerLimit" ? Number(value) : value;

    setFormData({ ...formData, [name]: newValue });

    // Validate numerical inputs
    if (name === "amount" || name === "lowerLimit") {
      if (newValue < 0) {
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
    if (formData.amount <= 0) {
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
      setNotification("Item created successfully!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      setFormData({
        name: "",
        amount: 0,
        description: "",
        status: "Not Set",
        lowerLimit: 0,
        machine_name: "",
        machine_number: "",
        section_name: "",
        section_number: "",
      });
      navigate("/items");
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
  };

  const handleMachineChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNewMachine(true);
      setFormData({ ...formData, machine_name: "", machine_number: "" });
    } else {
      setIsNewMachine(false);
      const selectedMachine = machines.find((machine) => machine.machine_name === value);
      setFormData({
        ...formData,
        machine_name: value,
        machine_number: selectedMachine?.machine_number || "",
        section_name: selectedMachine?.section?.section_name || "",
        section_number: selectedMachine?.section?.section_number || "",
      });
    }
  };

  const handleSectionChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNewSection(true);
      setFormData({ ...formData, section_name: "", section_number: "" });
    } else {
      setIsNewSection(false);
      setFormData({
        ...formData,
        section_name: value,
        section_number: sections.find((section) => section.section_name === value)?.section_number || "",
      });
    }
  };

  const fetchMachines = async () => {
    const response = await getMachines();
    setMachines(response);
  };

  const fetchSections = async () => {
    const response = await getSections();
    setSections(response);
  };

  useEffect(() => {
    fetchMachines();
    fetchSections();
  }, []);

  return (
    <div>
      {notification && <div className="mb-4 p-2 text-white bg-green-500 rounded">{notification}</div>}
      <form onSubmit={handleSubmit} className="shadow-md p-3 rounded">
        <FormField label="Name" name="name" value={formData.name} onChange={handleChange} />
        <FormField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} />
        <FormField label="Description" name="description" value={formData.description} onChange={handleChange} />
        <FormField label="Year" name="year" value={formData.year} onChange={handleChange} />
        <FormField label="Replacement Type" type="select" name="replacementType" value={formData.replacementType} onChange={handleChange}>
          <option value="" disabled>
            Select Type
          </option>
          <option value="Swap">Swap</option>
          <option value="Replace">Replace</option>
        </FormField>
        <FormField label="Status" name="status" type="select" value={formData.status} onChange={handleChange}>
          <option value="Not Set" disabled>
            Not Set
          </option>
          <option value="In Use">In Use</option>
          <option value="Spare">Spare</option>
          <option value="Repair">Repair</option>
          <option value="Broken">Broken</option>
        </FormField>
        <FormField label="Lower Limit" name="lowerLimit" type="number" value={formData.lowerLimit} onChange={handleChange} error={errors.lowerLimit} />

        <FormField label="Machine Name" name="machine_name" value={isNewMachine ? "new" : formData.machine_name} onChange={handleMachineChange} type="select">
          <option value="" disabled>
            Pilih Machine
          </option>
          <option value="new">Enter New Machine</option>
          {machines &&
            machines.map((data) => (
              <option key={data.uuid} value={data.machine_name}>
                {data.machine_name}
              </option>
            ))}
        </FormField>
        {isNewMachine && <FormField label="New Machine Name" name="machine_name" value={formData.machine_name} onChange={handleChange} />}

        <FormField label="Machine Number" name="machine_number" value={formData.machine_number} onChange={handleChange} />

        <FormField label="Section Name" name="section_name" value={isNewSection ? "new" : formData.section_name} onChange={handleSectionChange} type="select">
          <option value="" disabled>
            Pilih Section
          </option>
          <option value="new">Enter New Section</option>
          {sections &&
            sections.map((data) => (
              <option key={data.uuid} value={data.section_name}>
                {data.section_name}
              </option>
            ))}
        </FormField>
        {isNewSection && <FormField label="New Section Name" name="section_name" value={formData.section_name} onChange={handleChange} />}

        <FormField label="Section Number" name="section_number" value={formData.section_number} onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;

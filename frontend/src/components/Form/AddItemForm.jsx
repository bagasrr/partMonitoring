import React, { useEffect, useState } from "react";
import { createItem, getItems } from "../../utils/items";
import FormField from "../FormField";
import { useNavigate } from "react-router-dom";
import { getMachines } from "../../utils/machines";
import { getSections } from "../../utils/getSection";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import useNotification from "../../services/Notification";

const AddItemForm = () => {
  const navigate = useNavigate();
  const [part, setPart] = useState([]);
  const [machines, setMachines] = useState([]);
  const [sections, setSections] = useState([]);
  const [isNewPart, setIsNewPart] = useState(false);
  const [isNewMachine, setIsNewMachine] = useState(false);
  const [isNewSection, setIsNewSection] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const notification = useNotification();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    status: "Not Set",
    lowerLimit: "",
    machine_name: "",
    machine_number: "",
    section_name: "",
    section_number: "",
    replacementType: "",
    year: "",
  });

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
    if (formData.year > new Date().getFullYear()) {
      newErrors.year = "Tahun tidak bisa lebih dari tahun sekarang";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await createItem(formData);
      // setNotification("Part created successfully!");
      dispatch(setNotification(`Part ${formData.name} Added`));
      navigate("/items");
      setFormData({
        name: "",
        amount: "",
        description: "",
        status: "Not Set",
        lowerLimit: "",
        machine_name: "",
        machine_number: "",
        section_name: "",
        section_number: "",
      });
    } catch (error) {
      setError(true);
      setNotification(`Error: ${error.message}`);
    }
  };

  const handlePartChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNewPart(true);
      setFormData({ ...formData, name: "", amount: "", description: "" });
    } else {
      setIsNewPart(false);
      const selectedPart = part.find((part) => part.name === value);
      setFormData({
        ...formData,
        name: value,
        year: selectedPart?.year || "",
        lowerLimit: selectedPart?.lowerLimit || "",
        machine_name: selectedPart?.machine?.machine_name || "",
        machine_number: selectedPart?.machine?.machine_number || "",
      });
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

  const fetchPart = async () => {
    const response = await getItems();
    setPart(response);
  };

  const fetchSections = async () => {
    const response = await getSections();
    setSections(response);
  };

  useEffect(() => {
    fetchMachines();
    fetchSections();
    fetchPart();
  }, []);

  return (
    <div>
      {notification && <div className="mb-4 p-2 text-white bg-green-500 rounded">{notification}</div>}
      <form onSubmit={handleSubmit} className="shadow-md bg-white p-5 rounded-lg">
        {/* <FormField label="Part Name" name="name" type="select" value={formData.name} onChange={handleChange} placeholder={"Masukkan nama part"}>
          <option value="" disabled>
            Select Part
          </option>
          {part &&
            part.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </FormField> */}
        <FormField label="Part Name" name="name" value={isNewPart ? "new" : formData.name} onChange={handlePartChange} type="select">
          <option value="" disabled>
            Pilih Part
          </option>
          <option value="new">Enter New Part</option>
          {part &&
            part.map((data) => (
              <option key={data.uuid} value={data.name}>
                {data.name}
              </option>
            ))}
        </FormField>
        {isNewPart && (
          <>
            <FormField label="New Part Name" name="name" value={formData.name} onChange={handleChange} placeholder={"Masukkan nama part baru"} />
          </>
        )}

        <FormField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} placeholder={"Masukkan jumlah part"} />
        <FormField label="Year" name="year" type="number" error={errors.year} value={formData.year} onChange={handleChange} placeholder={"Masukkan tahun"} />
        <FormField label="Description" name="description" value={formData.description} onChange={handleChange} placeholder={"Masukkan deskripsi"} />

        {isNewPart && (
          <>
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

            <FormField label="Lower Limit" name="lowerLimit" type="number" value={formData.lowerLimit} onChange={handleChange} error={errors.lowerLimit} placeholder={"Masukkan batas minimum"} />
          </>
        )}

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
        {isNewMachine && (
          <>
            <FormField label="New Machine Name" name="machine_name" value={formData.machine_name} onChange={handleChange} placeholder={"Masukkan nama machine baru"} />
            <FormField label="Machine Number" name="machine_number" value={formData.machine_number} onChange={handleChange} placeholder={"Masukkan nomor machine"} />

            <FormField label="Room Name" name="section_name" value={isNewSection ? "new" : formData.section_name} onChange={handleSectionChange} type="select">
              <option value="" disabled>
                Pilih Ruangan
              </option>
              <option value="new">Enter New Section Room</option>
              {sections &&
                sections.map((data) => (
                  <option key={data.uuid} value={data.section_name}>
                    {data.section_name}
                  </option>
                ))}
            </FormField>
            {isNewSection && (
              <>
                <FormField label="New Room Name" name="section_name" value={formData.section_name} onChange={handleChange} placeholder={"Masukkan nama ruangan baru"} />

                <FormField label="Room Number" name="section_number" value={formData.section_number} onChange={handleChange} placeholder={"Masukkan nomor ruangan"} />
              </>
            )}
          </>
        )}
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;

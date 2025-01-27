import React, { useEffect, useState } from "react";
import FormField from "../FormField";
import { getSections } from "../../utils/section";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import { createMachines } from "../../utils/machines";
import Button from "../../element/Button";

const AddMachineForm = () => {
  const [sections, setSections] = useState([]);
  const [isNewSection, setIsNewSection] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    machineName: "",
    machineNumber: "",
    sectionName: "",
    sectionNumber: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    const response = await getSections();
    setSections(response);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSectionChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNewSection(true);
      setFormData({ ...formData, sectionName: "", sectionNumber: "" });
    } else {
      setIsNewSection(false);
      setFormData({
        ...formData,
        sectionName: value,
        sectionNumber: sections.find((section) => section.section_name === value)?.section_number || "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      machine_name: formData.machineName,
      machine_number: formData.machineNumber,
      section_name: formData.sectionName,
      section_number: formData.sectionNumber,
    };

    try {
      setIsLoading(true);
      await createMachines(data);
      dispatch(setNotification(`Machine ${formData.machineName} Added`));
      navigate("/machines");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error.response);
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Adding Machine...</LoadingAnimate>}
      {error && <p className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded relative mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <FormField label="Machine Name" name="machineName" value={formData.machineName} onChange={handleChange} placeholder={"Masukkan nama mesin"} />
        <FormField label="Machine Number" name="machineNumber" value={formData.machineNumber} onChange={handleChange} placeholder={"Masukkan nomor mesin"} />
        <FormField label="Section Name" name="sectionName" value={isNewSection ? "new" : formData.sectionName} onChange={handleSectionChange} type="select">
          <option value="">Pilih Section</option>
          <option value="new">Enter New Section Room</option>

          {sections &&
            sections.map((data) => (
              <option key={data.uuid} value={data.section_name}>
                {data.section_name}
              </option>
            ))}
        </FormField>
        {isNewSection && <FormField label="New Section Room Name" name="sectionName" value={formData.sectionName} onChange={handleChange} placeholder={"Masukkan nama ruangan baru"} />}
        <FormField label="Section Room Number" name="sectionNumber" type="number" value={formData.sectionNumber} onChange={handleChange} placeholder={"Masukkan nomor ruangan"} />
        <Button type="submit" buttonName="Add Machine" />
      </form>
    </div>
  );
};

export default AddMachineForm;

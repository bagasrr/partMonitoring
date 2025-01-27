import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMachineById, updateMachines } from "../../utils/machines";
import FormField from "../FormField";
import { setNotification } from "../../features/notificationSlice";
import Button from "../../element/Button";
import LoadingAnimate from "../LoadingAnimate";

const EditMachineForm = () => {
  const [formData, setFormData] = useState({
    machine_name: "",
    machine_number: "",
    section_name: "",
    section_number: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [notif, setNotif] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMachine();
  }, []);

  const fetchMachine = async () => {
    try {
      const data = await getMachineById(id);
      console.log(data);

      setFormData({
        machine_name: data.machine_name,
        machine_number: data.machine_number,
        section_name: data.section?.section_name || "",
        section_number: data.section?.section_number || "",
      });
    } catch (error) {
      setNotif(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await updateMachines(id, formData);
      dispatch(setNotification(`Machine ${formData.machine_name} Updated`));
      navigate("/machines");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setNotif(error.message);
    }
  };

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Editing Machine...</LoadingAnimate>}
      {notif && <div className="mt-4 p-2 text-white bg-red-500 rounded">{notif}</div>}
      <form onSubmit={handleSubmit}>
        <FormField label="Machine Name" name="machine_name" value={formData.machine_name || ""} onChange={handleChange} />
        <FormField label="Machine Number" name="machine_number" type="text" value={formData.machine_number || ""} onChange={handleChange} />
        <FormField label="Section Name" name="section_name" value={formData.section_name || ""} onChange={handleChange} />
        <FormField label="Section Number" name="section_number" type="text" value={formData.section_number || ""} onChange={handleChange} />

        <Button type="submit" buttonName="Save" />

        {notif && <div className={`mt-4 p-2 text-white ${notif ? "bg-red-500" : "bg-green-500"} rounded`}>{notif}</div>}
      </form>
    </div>
  );
};

export default EditMachineForm;

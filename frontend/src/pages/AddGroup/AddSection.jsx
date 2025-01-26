import React, { useState } from "react";
import FormLayout from "../FormLayout";
import { NormalInput } from "../../element/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import useNotification from "../../services/Notification";
import { adminArea } from "../../utils/adminArea";
import { createSection } from "../../utils/section";
import LoadingAnimate from "../../components/LoadingAnimate";

const AddSection = () => {
  adminArea();
  const [formData, setFormData] = useState({
    sectionName: "",
    sectionNumber: "",
  });
  const [sectionName, setSectionName] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notification = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      section_name: sectionName,
      section_number: sectionNumber,
    };
    try {
      setIsLoading(true);
      await createSection(data);
      navigate("/sections");
      dispatch(setNotification(`Section ${sectionName} Added`));
    } catch (error) {
      dispatch(setNotification(error.response.data.message));
    }
  };
  return (
    <>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Adding Section Room...</LoadingAnimate>}
      <FormLayout formTitle={"Tambah Ruangan"} onSubmit={handleSubmit}>
        {notification && <p className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded relative mb-4">{notification}</p>}

        <NormalInput label="Nama Ruangan" id="section_name" type="text" onChange={(e) => setSectionName(e.target.value)} />
        <NormalInput label="Nomor Ruangan" id="section_number" type="text" onChange={(e) => setSectionNumber(e.target.value)} />
      </FormLayout>
    </>
  );
};

export default AddSection;

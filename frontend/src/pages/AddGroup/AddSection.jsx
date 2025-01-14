import React, { useState } from "react";
import FormLayout from "../FormLayout";
import { NormalInput } from "../../element/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";

const AddSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/sections", {
      section_name: sectionName,
      section_number: sectionNumber,
    });
    navigate("/sections");
    dispatch(setNotification(`Section ${sectionName}Added`));
  };
  return (
    <FormLayout formTitle={"Tambah Ruangan"} onSubmit={handleSubmit}>
      <NormalInput label="Nama Ruangan" id="section_name" type="text" onChange={(e) => setSectionName(e.target.value)} />
      <NormalInput label="Nomor Ruangan" id="section_number" type="text" onChange={(e) => setSectionNumber(e.target.value)} />
    </FormLayout>
  );
};

export default AddSection;

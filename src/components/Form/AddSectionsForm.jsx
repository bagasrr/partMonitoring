import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../FormField";
import Button from "../../element/Button";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import ErrorText from "../ErrorText";
import LoadingAnimate from "../LoadingAnimate";
import { createSection } from "../../utils/section";

const AddSectionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    section_name: "",
    section_number: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "section_number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await createSection(formData);
      setIsLoading(true);
      navigate("/sections");
      dispatch(setNotification(" Section Added"));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Adding Machine...</LoadingAnimate>}
      <FormField label="Section Name" name="section_name" type="text" value={formData.section_name} onChange={handleChange} placeholder="Section Name here" />

      <FormField label="Section Number" name="section_number" type="number" value={formData.section_number} onChange={handleChange} placeholder="Number must be a num" />
      {error && <ErrorText message={error} />}
      <Button type="submit" buttonName="Submit" />
    </form>
  );
};

export default AddSectionForm;

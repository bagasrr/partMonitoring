import React, { useEffect, useState } from "react";
import { getSectionByID, updateSection } from "../../utils/section";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "../FormField";
import Button from "../../element/Button";
import { useDispatch } from "react-redux";
import LoadingAnimate from "../LoadingAnimate";
import { setNotification } from "../../features/notificationSlice";

const EditSectionForm = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    section_name: "",
    section_number: "",
  });

  useEffect(() => {
    fetchSection();
  }, [id]);

  const fetchSection = async () => {
    const response = await getSectionByID(id);
    setFormData({
      section_name: response.section_name,
      section_number: response.section_number,
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateSection(id, formData);
      setIsLoading(false);
      dispatch(setNotification(`Section ${formData.section_name} Updated`));
      navigate("/sections");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Editing Section...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField formData={formData.section_name} name={"section_name"} setFormData={setFormData.section_name} label={"Section Name"} onChange={handleChange} value={formData.section_name} />
        <FormField formData={formData.section_number} name={"section_number"} setFormData={setFormData.section_number} label={"Section Number"} onChange={handleChange} value={formData.section_number} />
        <Button type="submit" buttonName="Save" />
      </form>
    </>
  );
};

export default EditSectionForm;

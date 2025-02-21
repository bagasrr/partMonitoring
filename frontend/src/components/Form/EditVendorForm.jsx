import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormField from "../FormField";
import Button from "../../element/Button";
import { useDispatch } from "react-redux";
import LoadingAnimate from "../LoadingAnimate";
import { setNotification } from "../../features/notificationSlice";
import { getVendorByID, updateVendor } from "../../utils/vendor";

const EditVendorForm = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    vendor_name: "",
  });

  useEffect(() => {
    fetchvendor();
  }, [id]);

  const fetchvendor = async () => {
    const response = await getVendorByID(id);
    setFormData({
      vendor_name: response.vendor_name,
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
      await updateVendor(id, formData);
      setIsLoading(false);
      dispatch(setNotification(`vendor ${formData.vendor_name} Updated`));
      navigate("/vendors");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Editing vendor...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField formData={formData.vendor_name} name={"vendor_name"} setFormData={setFormData.vendor_name} label={"vendor Name"} onChange={handleChange} value={formData.vendor_name} />
        <Button type="submit" buttonName="Save" />
      </form>
    </>
  );
};

export default EditVendorForm;

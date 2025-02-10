import React, { useState } from "react";
import Layout from "../layout";
import BackPrev from "../../element/BackPrev";
import FormField from "../../components/FormField";
import Button from "../../element/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Title from "../../element/Title";
import { setDeleted, setNotification } from "../../features/notificationSlice";
import LoadingAnimate from "../../components/LoadingAnimate";
import NotificationBar from "../../components/NotificationBar";
import { createVendor } from "../../utils/vendor";

const AddVendor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [vendorName, setVendorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      vendor_name: vendorName,
    };
    try {
      setIsLoading(true);
      await createVendor(data);
      dispatch(setNotification(`${vendorName} Added`));
      navigate("/vendors");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(setNotification(`error:${error.message}`));
      dispatch(setDeleted(true));
    }
  };
  return (
    <>
      {isLoading && <LoadingAnimate />}
      <BackPrev url="/vendors" />
      <Title>Add new Vendor</Title>
      <NotificationBar />

      <form onSubmit={handleSubmit}>
        <FormField
          label="Vendor Name"
          name="vendor_name"
          type="text"
          value={vendorName}
          onChange={(e) => {
            setVendorName(e.target.value);
          }}
          placeholder="Vendor Name here"
        />
        <Button type="submit" buttonName={"Add Vendor"} />
      </form>
    </>
  );
};

export default AddVendor;

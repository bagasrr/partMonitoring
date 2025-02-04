import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";
import BackPrev from "../../element/BackPrev";
import FormField from "../../components/FormField";
import Button from "../../element/Button";
import { Title } from "chart.js";

const AddVendor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [vendorName, setVendorName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log(vendorName);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Layout>
      <BackPrev url="/vendors" />
      <Title>Add new Vendor</Title>

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
    </Layout>
  );
};

export default AddVendor;

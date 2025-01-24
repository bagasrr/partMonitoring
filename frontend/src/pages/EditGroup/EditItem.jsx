import React from "react";
import EditItemForm from "../../components/Form/EditItemForm";
import Title from "../../element/Title";
import Layout from "../Layout";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";

const EditItem = () => {
  adminArea();
  return (
    <Layout>
      <BackPrev url="/parts" />
      <Title>Edit Part</Title>
      <EditItemForm />
    </Layout>
  );
};

export default EditItem;

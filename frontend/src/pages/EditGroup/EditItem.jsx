import React from "react";
import EditItemForm from "../../components/Form/EditItemForm";
import Title from "../../element/Title";
import Layout from "../Layout";

const EditItem = () => {
  return (
    <Layout>
      <Title>Edit Item</Title>
      <EditItemForm />
    </Layout>
  );
};

export default EditItem;

import React from "react";
import AddItemForm from "../../components/Form/AddItemForm";
import Title from "../../element/Title";
import Layout from "../Layout";

const AddItemPages = () => {
  return (
    <Layout>
      <Title>Tambah Part Baru</Title>
      <AddItemForm />
    </Layout>
  );
};

export default AddItemPages;

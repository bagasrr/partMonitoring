import React, { useEffect } from "react";
import AddItemForm from "../../components/Form/AddItemForm";
import Title from "../../element/Title";
import Layout from "../Layout";
import BackPrev from "../../element/BackPrev";

const AddItemPages = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <Layout>
      <BackPrev url="/parts" />
      <Title>Tambah Part Baru</Title>
      <AddItemForm />
    </Layout>
  );
};

export default AddItemPages;

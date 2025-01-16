import React from "react";
import Title from "../../element/Title";
import AddMachineForm from "../../components/Form/AddMachineForm";
import Layout from "../Layout";

const AddMachineNew = () => {
  return (
    <Layout>
      <Title>Add new Machine</Title>
      <AddMachineForm />
    </Layout>
  );
};

export default AddMachineNew;

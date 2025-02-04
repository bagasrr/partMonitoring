import React from "react";
import Title from "../../element/Title";
import AddMachineForm from "../../components/Form/AddMachineForm";
import Layout from "../layout";
import BackPrev from "../../element/BackPrev";

const AddMachineNew = () => {
  return (
    <Layout>
      <BackPrev url="/machines" />
      <Title>Add new Machine</Title>
      <AddMachineForm />
    </Layout>
  );
};

export default AddMachineNew;

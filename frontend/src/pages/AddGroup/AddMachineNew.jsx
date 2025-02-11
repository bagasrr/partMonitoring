import React from "react";
import Title from "../../element/Title";
import AddMachineForm from "../../components/Form/AddMachineForm";
import BackPrev from "../../element/BackPrev";
import { Helmet } from "react-helmet-async";

const AddMachineNew = () => {
  return (
    <>
      <Helmet>
        <title>Add Machine | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/machines" />
      <Title>Add new Machine</Title>
      <AddMachineForm />
    </>
  );
};

export default AddMachineNew;

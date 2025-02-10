import React from "react";
import Title from "../../element/Title";
import AddMachineForm from "../../components/Form/AddMachineForm";
import BackPrev from "../../element/BackPrev";

const AddMachineNew = () => {
  return (
    <>
      <BackPrev url="/machines" />
      <Title>Add new Machine</Title>
      <AddMachineForm />
    </>
  );
};

export default AddMachineNew;

import React from "react";
import Title from "../../element/Title";
import EditMachineForm from "../../components/Form/EditMachineForm";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";
import scrollToTop from "../../utils/scrollToTop";
import { Helmet } from "react-helmet-async";

const EditMachine = () => {
  scrollToTop();
  adminArea();
  return (
    <>
      <Helmet>
        <title>Edit Machine | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/machines" />

      <Title>Edit Machine</Title>
      <EditMachineForm />
    </>
  );
};

export default EditMachine;

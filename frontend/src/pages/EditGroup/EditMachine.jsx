import React from "react";
import Title from "../../element/Title";
import EditMachineForm from "../../components/Form/EditMachineForm";
import Layout from "../Layout";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";
import scrollToTop from "../../utils/scrollToTop";

const EditMachine = () => {
  scrollToTop();
  adminArea();
  return (
    <Layout>
      <BackPrev url="/machines" />

      <Title>Edit Machine</Title>
      <EditMachineForm />
    </Layout>
  );
};

export default EditMachine;

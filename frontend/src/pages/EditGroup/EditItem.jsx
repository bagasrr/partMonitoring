import React from "react";
import EditItemForm from "../../components/Form/EditItemForm";
import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";
import scrollToTop from "../../utils/scrollToTop";
import { Helmet } from "react-helmet-async";

const EditItem = () => {
  adminArea();
  scrollToTop();
  return (
    <>
      <Helmet>
        <title>Edit Part | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/parts" />
      <Title>Edit Part</Title>
      <EditItemForm />
    </>
  );
};

export default EditItem;

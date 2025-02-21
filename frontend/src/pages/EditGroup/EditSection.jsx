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
        <title>Edit Section | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/sections" />
      <Title>Edit Section</Title>
      <EditItemForm />
    </>
  );
};

export default EditItem;

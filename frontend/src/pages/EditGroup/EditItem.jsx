import React from "react";
import EditItemForm from "../../components/Form/EditItemForm";
import Title from "../../element/Title";
import Layout from "../Layout";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";
import scrollToTop from "../../utils/scrollToTop";

const EditItem = () => {
  adminArea();
  scrollToTop();
  return (
    <>
      <BackPrev url="/parts" />
      <Title>Edit Part</Title>
      <EditItemForm />
    </>
  );
};

export default EditItem;

import React from "react";
import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import AddUsersForm from "../../components/Form/AddUsersForm";
import AddSectionForm from "../../components/Form/AddSectionsForm";

const AddUser = () => {
  return (
    <>
      <BackPrev url="/sections" />
      <Title>Add new Section</Title>
      <AddSectionForm />
    </>
  );
};

export default AddUser;

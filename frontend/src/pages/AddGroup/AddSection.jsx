import React from "react";
import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import AddUsersForm from "../../components/Form/AddUsersForm";
import AddSectionForm from "../../components/Form/AddSectionsForm";
import { Helmet } from "react-helmet-async";

const AddUser = () => {
  return (
    <>
      <Helmet>
        <title>Add Section | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/sections" />
      <Title>Add new Section</Title>
      <AddSectionForm />
    </>
  );
};

export default AddUser;

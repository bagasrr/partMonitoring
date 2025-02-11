import React from "react";
import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import AddUsersForm from "../../components/Form/AddUsersForm";
import { Helmet } from "react-helmet-async";

const AddUser = () => {
  return (
    <>
      <Helmet>
        <title>Add User | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/users" />
      <Title>Add new User</Title>
      <AddUsersForm isCreateByAdmin={true} />
    </>
  );
};

export default AddUser;

import React from "react";
import Title from "../../element/Title";
import Layout from "../layout";
import BackPrev from "../../element/BackPrev";
import AddUsersForm from "../../components/Form/AddUsersForm";

const AddUser = () => {
  return (
    <Layout>
      <BackPrev url="/users" />
      <Title>Add new User</Title>
      <AddUsersForm isCreateByAdmin={true} />
    </Layout>
  );
};

export default AddUser;

import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import UsersTable from "../components/UsersTable";
import Title from "../element/Title";
import { adminArea } from "../utils/adminArea";

const Users = () => {
  adminArea();
  return (
    <Layout>
      <Title>Users</Title>
      <div className="mb-10">
        <Link to="/users/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
          Add User
        </Link>
      </div>

      <UsersTable />
    </Layout>
  );
};

export default Users;

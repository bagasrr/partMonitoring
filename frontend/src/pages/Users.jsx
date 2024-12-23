import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import UsersTable from "../components/UsersTable";

const Users = () => {
  return (
    <Layout>
      <div className="mb-10">
        <Link to="/user/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
          Tambah Item
        </Link>
      </div>

      <UsersTable />
    </Layout>
  );
};

export default Users;

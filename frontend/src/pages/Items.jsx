import React, { useEffect, useState } from "react";
import ItemsTable from "../components/ItemsTable";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Title from "../element/Title";

const Items = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <Title>Items</Title>
      {user && user.role === "admin" && (
        <div className="mb-10">
          <Link to="/items/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
            Tambah Item
          </Link>
        </div>
      )}

      <ItemsTable />
    </Layout>
  );
};

export default Items;

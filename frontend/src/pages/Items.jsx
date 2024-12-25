import React, { useEffect, useState } from "react";
import ItemsTable from "../components/ItemsTable";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Items = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-10">Parts</h1>
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

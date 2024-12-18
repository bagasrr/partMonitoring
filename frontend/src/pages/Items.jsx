import React, { useEffect, useState } from "react";
import ItemsTable from "../components/ItemsTable";
import Layout from "./Layout";
import { Link } from "react-router-dom";

const Items = () => {
  return (
    <Layout>
      <div className="mb-10">
        <Link to="/items/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
          Tambah Item
        </Link>
      </div>

      <ItemsTable />
    </Layout>
  );
};

export default Items;

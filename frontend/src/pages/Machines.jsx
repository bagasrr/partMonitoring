import React from "react";
import Layout from "./Layout";
import MachinesTable from "../components/MachinesTable";
import Title from "../element/Title";
import { Link } from "react-router-dom";

const Machines = () => {
  return (
    <Layout>
      <Title>Machines</Title>
      <div className="mb-10">
        <Link to="/machines/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
          Tambah Mesin
        </Link>
      </div>

      <MachinesTable />
    </Layout>
  );
};

export default Machines;

import React from "react";
import Layout from "./Layout";
import SectionsTable from "../components/SectionsTable";
import Title from "../element/Title";
import { Link } from "react-router-dom";

const Sections = () => {
  return (
    <Layout>
      <Title>Sections</Title>

      <div className="mb-10">
        <Link to="/sections/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-fit">
          Tambah Ruangan
        </Link>
      </div>

      <SectionsTable />
    </Layout>
  );
};

export default Sections;

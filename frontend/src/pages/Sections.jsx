import React from "react";
import Layout from "./Layout";
import SectionsTable from "../components/SectionsTable";
import Title from "../element/Title";
import { Link } from "react-router-dom";
import ScrollToTop from "../utils/scrollToTop";
import { FiPlusCircle } from "react-icons/fi";

const Sections = () => {
  ScrollToTop();
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <Title>Ruangan List</Title>
        <div className="mb-10 flex justify-center w-full">
          <Link to="/sections/add" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FiPlusCircle size={24} />
            Tambah mesin
          </Link>
        </div>
      </div>

      <SectionsTable />
    </Layout>
  );
};

export default Sections;

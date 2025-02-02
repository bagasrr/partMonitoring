import React from "react";
import SectionsTable from "../components/SectionsTable";
import Title from "../element/Title";
import { Link } from "react-router-dom";
import ScrollToTop from "../utils/scrollToTop";
import { FiPlusCircle } from "react-icons/fi";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";

const Sections = () => {
  ScrollToTop();
  return (
    <Layout>
      {/* <div className="flex flex-col items-center">
        <Title>Section Room</Title>
        <div className="mb-10 flex justify-center w-full">
          <Link to="/sections/add" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FiPlusCircle size={24} />
            Add Machine
          </Link>
        </div>
      </div> */}
      <HeaderPages title="Section Room" linkAdd="sections" add="section" />
      <SectionsTable />
    </Layout>
  );
};

export default Sections;

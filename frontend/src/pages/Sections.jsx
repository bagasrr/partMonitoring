import React from "react";
import SectionsTable from "../components/SectionsTable";
import Title from "../element/Title";
import { Link } from "react-router-dom";
import ScrollToTop from "../utils/scrollToTop";
import { FiPlusCircle } from "react-icons/fi";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";
import { adminArea } from "../utils/adminArea";

const Sections = () => {
  ScrollToTop();
  adminArea();
  return (
    <Layout>
      <HeaderPages title="Section Room" linkAdd="sections" add="section" />
      <SectionsTable />
    </Layout>
  );
};

export default Sections;

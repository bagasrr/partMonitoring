import React from "react";
import Layout from "./Layout";
import MachinesTable from "../components/MachinesTable";
import Title from "../element/Title";
import { Link } from "react-router-dom";
import scrollToTop from "../utils/scrollToTop";
import { FiPlusCircle } from "react-icons/fi";
import HeaderPages from "../components/headerPages";

const Machines = () => {
  scrollToTop();
  return (
    <Layout>
      <HeaderPages title="Mesin List" linkAdd="machines" add="mesin" />

      <MachinesTable />
    </Layout>
  );
};

export default Machines;

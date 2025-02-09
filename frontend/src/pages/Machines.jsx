import React from "react";
import MachinesTable from "../components/MachinesTable";
import scrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/headerPages";
import Layout from "./layout";
import { adminArea } from "../utils/adminArea";

const Machines = () => {
  scrollToTop();
  adminArea();
  return (
    <Layout>
      <HeaderPages title="Mesin List" linkAdd="machines" add="mesin" />

      <MachinesTable />
    </Layout>
  );
};

export default Machines;

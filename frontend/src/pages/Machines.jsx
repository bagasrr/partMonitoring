import React from "react";
import MachinesTable from "../components/MachinesTable";
import scrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/headerPages";
import { adminArea } from "../utils/adminArea";
import { Helmet } from "react-helmet-async";

const Machines = () => {
  scrollToTop();
  adminArea();
  return (
    <>
      <Helmet>
        <title>Machines | Part Monitoring</title>
      </Helmet>
      <HeaderPages title="Mesin List" linkAdd="machines" add="mesin" />

      <MachinesTable />
    </>
  );
};

export default Machines;

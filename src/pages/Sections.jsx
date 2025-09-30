import React from "react";
import SectionsTable from "../components/SectionsTable";
import ScrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/HeaderPages";
import { adminArea } from "../utils/adminArea";
import { Helmet } from "react-helmet-async";

const Sections = () => {
  ScrollToTop();
  adminArea();
  return (
    <>
      <Helmet>
        <title>Section | Part Monitoring</title>
      </Helmet>
      <HeaderPages title="Section Room" linkAdd="sections" add="section" />
      <SectionsTable />
    </>
  );
};

export default Sections;

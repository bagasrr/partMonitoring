import React from "react";
import Layout from "./Layout";
import SectionsTable from "../components/SectionsTable";
import Title from "../element/Title";

const Sections = () => {
  return (
    <Layout>
      <Title>Sections</Title>

      <SectionsTable />
    </Layout>
  );
};

export default Sections;

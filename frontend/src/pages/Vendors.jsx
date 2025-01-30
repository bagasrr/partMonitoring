import React from "react";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";
import VendorTable from "../components/VendorTable";

const Vendors = () => {
  return (
    <Layout>
      <HeaderPages title="Vendors" linkAdd="vendors" add="vendor" />
      <VendorTable />
    </Layout>
  );
};

export default Vendors;

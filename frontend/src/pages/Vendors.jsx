import React from "react";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";
import VendorTable from "../components/VendorTable";
import ScrollToTop from "../utils/scrollToTop";
import { adminArea } from "../utils/adminArea";

const Vendors = () => {
  ScrollToTop();
  adminArea();
  return (
    <Layout>
      <HeaderPages title="Vendors" linkAdd="vendors" add="vendor" />
      <VendorTable />
    </Layout>
  );
};

export default Vendors;

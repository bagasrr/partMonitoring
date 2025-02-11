import React from "react";
import HeaderPages from "../components/headerPages";
import VendorTable from "../components/VendorTable";
import ScrollToTop from "../utils/scrollToTop";
import { adminArea } from "../utils/adminArea";
import { Helmet } from "react-helmet-async";

const Vendors = () => {
  ScrollToTop();
  adminArea();
  return (
    <>
      <Helmet>
        <title>Vendors | Part Monitoring</title>
      </Helmet>
      <HeaderPages title="Vendors" linkAdd="vendors" add="vendor" />
      <VendorTable />
    </>
  );
};

export default Vendors;

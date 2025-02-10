import React from "react";
import HeaderPages from "../components/headerPages";
import VendorTable from "../components/VendorTable";
import ScrollToTop from "../utils/scrollToTop";
import { adminArea } from "../utils/adminArea";

const Vendors = () => {
  ScrollToTop();
  adminArea();
  return (
    <>
      <HeaderPages title="Vendors" linkAdd="vendors" add="vendor" />
      <VendorTable />
    </>
  );
};

export default Vendors;

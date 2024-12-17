import React from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>
        <Sidebar />

        <div className="ml-64 mt-16 p-10">{children}</div>
      </div>
    </>
  );
};

export default Layout;

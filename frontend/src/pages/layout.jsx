import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, setSidebarOpen } from "../features/sidebarSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.sidebar.isOpen);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        dispatch(setSidebarOpen(true));
      } else {
        dispatch(setSidebarOpen(false));
      }
    };

    // Set the initial state based on window size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />
        <main className={`flex-1 overflow-x-hidden transition-all duration-300 p-10 mt-16 ${sidebarOpen ? "ml-64" : "ml-0"}`}>{children}</main>
      </div>

      <div className={`${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

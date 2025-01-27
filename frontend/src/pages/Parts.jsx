import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import Layout from "./Layout";
import Title from "../element/Title";
import scrollToTop from "../utils/scrollToTop";
import ItemsReplace from "../components/ItemsReplace";
import ItemsSwap from "../components/ItemsSwap";
import HeaderPages from "../components/headerPages";

const Parts = () => {
  scrollToTop();
  const [view, setView] = useState("swap");

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        {/* <Title className="text-4xl font-bold mb-4 text-center text-gradient">Part List</Title>
        <div className="flex gap-5 mb-10">
          <button className={`px-6 py-3 rounded-lg font-semibold ${view === "swap" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setView("swap")}>
            Swap
          </button>
          <button className={`px-6 py-3 rounded-lg font-semibold ${view === "replace" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setView("replace")}>
            Replace
          </button>
        </div>

        <div className="mb-10 flex justify-center w-full">
          <Link to="/parts/add" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
            <FiPlusCircle size={24} />
            Tambah Part Baru
          </Link>
        </div> */}
        <HeaderPages title="Part List" linkAdd="parts" add="part">
          <div className="flex gap-5 mb-10">
            <button className={`px-6 py-3 rounded-lg font-semibold ${view === "swap" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setView("swap")}>
              Swap
            </button>
            <button className={`px-6 py-3 rounded-lg font-semibold ${view === "replace" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setView("replace")}>
              Replace
            </button>
          </div>
        </HeaderPages>

        <div className="w-full">
          {view === "replace" && <ItemsReplace />}
          {view === "swap" && <ItemsSwap />}
        </div>
      </div>
    </Layout>
  );
};

export default Parts;

import React from "react";
import Title from "../element/Title";
import { FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const HeaderPages = ({ title, linkAdd, add, children }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title>{title}</Title>
      {children}
      <div className="mb-10 flex justify-center w-full">
        <Link to={`/${linkAdd}/add`} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
          <FiPlusCircle size={24} />
          Tambah {add}
        </Link>
      </div>
    </div>
  );
};

export default HeaderPages;

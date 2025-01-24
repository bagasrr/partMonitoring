import React from "react";

import { GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
const BackPrev = ({ url }) => {
  return (
    <Link to={url} className="flex w-fit gap-1 items-center mb-5 bg-blue-500 text-white px-4 py-2 rounded border border-blue-500 hover:border-blue-500 hover:text-blue-500 hover:bg-transparent hover:shadow-md cursor-pointer">
      <GrFormPrevious />
      <span>Back</span>
    </Link>
  );
};

export default BackPrev;

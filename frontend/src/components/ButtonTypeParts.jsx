import React from "react";

const ButtonTypeParts = ({ view, setView, partType, children, className = "px-6 py-3 rounded-lg" }) => {
  return (
    <button className={`${className} font-semibold ${view === partType ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setView(partType)}>
      {children}
    </button>
  );
};

export default ButtonTypeParts;

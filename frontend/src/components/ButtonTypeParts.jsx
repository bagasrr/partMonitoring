import React from "react";

const ButtonTypeParts = ({ view, setView, partType, children, className = "px-6 py-3 rounded-lg" }) => {
  return (
    <button
      className={`${className} font-semibold transition-all duration-500 ease-in-out ${view === partType ? "bg-blue-600 text-white" : "border border-blue-600 bg-blue-200 hover:bg-blue-600 text-blue-600 hover:text-white "}`}
      onClick={() => setView(partType)}
    >
      {children}
    </button>
  );
};

export default ButtonTypeParts;

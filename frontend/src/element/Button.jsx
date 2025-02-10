import React from "react";

const Button = ({ type, buttonName, className = "bg-blue-500 hover:bg-blue-600" }) => {
  return (
    <button type={type} className={`w-full ${className} text-white py-2 rounded-md my-2`}>
      {buttonName}
    </button>
  );
};

export default Button;

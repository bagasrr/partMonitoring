import React from "react";

const Button = ({ type, buttonName }) => {
  return (
    <button type={type} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
      {buttonName}
    </button>
  );
};

export default Button;

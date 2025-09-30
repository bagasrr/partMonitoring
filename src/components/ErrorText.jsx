import React from "react";

export const ErrorText = ({ message }) => {
  return <p className="text-red-500 text-center mt-4 font-bold text-md">{message}</p>;
};

export default ErrorText;

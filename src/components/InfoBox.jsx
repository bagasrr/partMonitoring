import React from "react";

const InfoBox = ({ title, count, color, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white shadow rounded-lg p-6 cursor-pointer">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className={`text-2xl font-semibold ${color}`}>{count}</div>
    </div>
  );
};

export default InfoBox;

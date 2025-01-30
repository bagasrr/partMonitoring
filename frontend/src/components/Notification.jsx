import React from "react";

const Notification = ({ message, deleted }) => {
  return (
    <div className={`${deleted ? "bg-rose-100 border border-rose-400 text-rose-700" : "bg-green-100 border border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Notification;

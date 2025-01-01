import React from "react";

const DeleteConfirmModalBox = ({ show, onClose, onConfirm, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded shadow-md">
        <h2 className="text-xl mb-4">{title}</h2>
        <div className="mb-4 font-bold text-lg">{children}</div>
        <div className="flex justify-end gap-4">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Yes
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModalBox;

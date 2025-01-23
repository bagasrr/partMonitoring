import React from "react";

const DeleteConfirmModalBox = ({ show, onClose, onConfirm, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-95 hover:scale-100">
        <h2 className="text-2xl mb-4 text-white font-semibold">{title}</h2>
        <div className="mb-4 text-white text-lg">{children}</div>
        <div className="flex justify-end gap-4">
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Yes
          </button>
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModalBox;

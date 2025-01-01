import React from "react";
import { Link } from "react-router-dom";

const YoureNotAdmin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied!!!</h1>
        <p className="text-gray-700 mb-6">You do not have the necessary permissions to view this page.</p>
        <Link to="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default YoureNotAdmin;

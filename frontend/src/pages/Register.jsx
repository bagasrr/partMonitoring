import React from "react";
import AddUsersForm from "../components/Form/AddUsersForm";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <AddUsersForm isCreateByAdmin={false} />
      </div>
    </div>
  );
};

export default Register;

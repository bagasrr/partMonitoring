import React from "react";

const FormField = ({ label, name, value, onChange, type = "text", error, children }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold text-gray-700">{label}:</label>
      {type === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} className="mt-1 block w-full p-2 border focus:outline-none focus:ring focus:ring-green-600 rounded-md" />
      ) : type === "select" ? (
        <select name={name} value={value} onChange={onChange} className="mt-1 block w-full p-2 border focus:outline-none focus:ring focus:ring-green-600 rounded-md">
          {children}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} className="mt-1 block w-full p-2 border focus:outline-none focus:ring focus:ring-green-600 rounded-md" required />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormField;

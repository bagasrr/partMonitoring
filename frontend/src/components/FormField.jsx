import React from "react";

const FormField = ({ label, name, value, onChange, type = "text", error, children, placeholder }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numberValue = value.replace(/\D/g, ""); // Hanya angka
    onChange({ target: { name, value: numberValue } });
  };
  return (
    <div className="mb-4">
      <label className="block font-bold text-gray-700">{label}:</label>
      {type === "textarea" ? (
        <textarea name={name} value={value || ""} onChange={onChange} className={`mt-1 block w-full p-2 border focus:outline-none focus:ring focus:ring-green-600 rounded-md`} placeholder={placeholder} />
      ) : type === "select" ? (
        <select name={name} value={value || ""} onChange={onChange} className="mt-1 block w-full p-2 border focus:outline-none focus:ring focus:ring-green-600 rounded-md">
          {children}
        </select>
      ) : type === "number" ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={handleInputChange}
          className={`mt-1 block w-full p-2 border focus:outline-none focus:ring  rounded-md ${error ? "border-rose-500 focus:-ring-rose-700" : "focus:ring-green-600"}`}
          required
          placeholder={placeholder}
        />
      ) : (
        <input type={type} name={name} value={value || ""} onChange={onChange} className="mt-1 block w-full p-3 border focus:outline-none focus:ring focus:ring-green-600 rounded-md" required placeholder={placeholder} />
      )}
      {error && <p className="text-red-500 text-xs font-bold mt-1 ml-1">*{error}</p>}
    </div>
  );
};

export default FormField;

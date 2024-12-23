import { useState } from "react";

export const NormalInput = ({ value, type, id, onChange, label }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input type={type} id={id} value={value} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>
  );
};

export const OptionInput = ({ label, id, options, onSelectOption, placeholder = "Select or enter a value", type = "text" }) => {
  const [isNewOption, setIsNewOption] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={isNewOption ? "new" : selectedValue}
        onChange={(e) => {
          if (e.target.value === "new") {
            setIsNewOption(true);
            setSelectedValue("");
          } else {
            setIsNewOption(false);
            setSelectedValue(e.target.value);
            onSelectOption(e.target.value);
          }
        }}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
        <option value="new">Enter a new value</option>
      </select>
      {isNewOption && (
        <input
          type={type}
          placeholder={`Enter new ${label.toLowerCase()}`}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            onSelectOption(e.target.value);
          }}
          className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      )}
    </div>
  );
};

export const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block text-gray-700 text-sm font-bold mb-2">
      {children}
    </label>
  );
};

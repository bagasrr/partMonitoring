import { useState } from "react";
import { useSelector } from "react-redux";

export const NormalInput = ({ value, type, id, onChange, label, autoComplete = "off", maxLength = 500, placeholder, className, isError }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isError ? "border-red-500" : ""} ${className}`}
        autoComplete={autoComplete}
        required
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
};
export const PasswordInput = ({ value, type, id, onChange, label, autoComplete = "off", maxLength = 500, placeholder, className, isError }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isError ? "border-red-500" : ""} ${className}`}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
};

export const StokInput = ({ setStock, name, label = "Stock" }) => {
  const [Validate, setValidate] = useState(false);
  const handleStockChange = (e) => {
    try {
      const value = e.target.value;
      if (value < 0) {
        setValidate(true);
      } else {
        setValidate(false);
        setStock(value);
      }
      console.log(value);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type="number"
        id={name}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${Validate ? "border-red-500" : ""}`}
        min={0}
        required
        onChange={handleStockChange}
      />
      {Validate && <p className="text-red-500 text-xs mt-1 font-bold">Nilai Harus Lebih dari 0</p>}
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

export const Button = ({ children, onClick, type }) => {
  return (
    <button type={type} onClick={onClick} className="w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ">
      {children}
    </button>
  );
};

export const TextArea = ({ value, id, onChange, label, autoComplete = "off", maxLength = 500, placeholder, className, isError }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isError ? "border-red-500" : ""} ${className}`}
        autoComplete={autoComplete}
        required
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
};

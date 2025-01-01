import React from "react";

const ItemInput = ({ label, name, names, isNewName, setName, setIsNewName }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
        {label}
      </label>
      <select
        id="name"
        value={isNewName ? "new" : name}
        onChange={(e) => {
          if (e.target.value === "new") {
            setIsNewName(true);
            setName("");
          } else {
            setIsNewName(false);
            setName(e.target.value);
          }
        }}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="" disabled>
          Select or enter a name
        </option>
        {names.map((itemName, index) => (
          <option key={index} value={itemName}>
            {itemName}
          </option>
        ))}
        <option value="new">Enter a new name</option>
      </select>
      {isNewName && (
        <input
          type="text"
          placeholder="Enter new name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      )}
    </div>
  );
};

export default ItemInput;

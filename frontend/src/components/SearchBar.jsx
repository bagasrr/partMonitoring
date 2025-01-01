import React from "react";

const SearchBar = ({ search, setSearch, placeholder }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;

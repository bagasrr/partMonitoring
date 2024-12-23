import React from "react";

const StockInput = ({ stock, setStock }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
        Stock
      </label>
      <input
        type="number"
        id="stock"
        value={stock}
        onChange={(e) => setStock(e.target.value ? parseInt(e.target.value) : "")}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter stock quantity"
        required
      />
    </div>
  );
};

export default StockInput;

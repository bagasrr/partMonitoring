import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

const SearchAndPaginate = ({ data, searchPlaceholder, children }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const filteredData = data.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase())));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.max(0, Math.ceil(filteredData.length / itemsPerPage)); // Pastikan pageCount tidak negatif

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  // Reset currentPage jika melebihi pageCount
  useEffect(() => {
    if (currentPage >= pageCount && pageCount > 0) {
      setCurrentPage(pageCount - 1);
    }
  }, [pageCount, currentPage]);

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} placeholder={searchPlaceholder} />
      {children({ currentItems, search })} {/* Menggunakan children untuk render */}
      <Pagination pageCount={pageCount} handlePageClick={handlePageClick} forcePage={Math.min(currentPage, pageCount - 1)} />
    </div>
  );
};

export default SearchAndPaginate;

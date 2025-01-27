import React, { useEffect, useState } from "react";
import { getItemUseHistories } from "../utils/itemUseHistory";
import { format, differenceInDays } from "date-fns";
import SearchBar from "./SearchBar";
import { TData, ThData, TRow } from "../element/Table";
import TablePagination from "./TablePagination";

const formatDate = (dateString) => {
  return format(new Date(dateString), "dd-MM-yyyy");
};

const calculateTotalDays = (startDate, endDate) => {
  if (!endDate) return "-";
  return differenceInDays(new Date(endDate), new Date(startDate));
};

const ItemUseHistoryTable = () => {
  const [histories, setHistories] = useState([]);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    const data = await getItemUseHistories();
    console.log(data);
    setHistories(data);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Filter histories based on search input
  const filteredHistories = histories.filter((history) => history.item.name.toLowerCase().includes(search.toLowerCase()) || history.replacementItem.name.toLowerCase().includes(search.toLowerCase()));

  // Pagination logic
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search items name" />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white overflow-x-auto">
          <thead>
            <tr>
              <ThData>No</ThData>
              <ThData>Item Name</ThData>
              <ThData>Start Use Date</ThData>
              <ThData>End Use Date</ThData>
              <ThData>Total Use (Days)</ThData>
              <ThData>Replace To</ThData>
              <ThData>Use Count</ThData>
              <ThData>Reason</ThData>
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
            {currentItems.map((history, index) => (
              <TRow key={history.uuid}>
                <TData>{index + 1 + indexOfFirstItem}</TData>
                <TData>
                  {history.item.name} ({history.item.year})
                </TData>
                <TData>{formatDate(history.itemStartUseDate)}</TData>
                <TData>{history.itemEndUseDate ? formatDate(history.itemEndUseDate) : "-"}</TData>
                <TData>{calculateTotalDays(history.itemStartUseDate, history.itemEndUseDate)}</TData>
                <TData>
                  {history.replacementItem !== null ? (
                    <>
                      {history.replacementItem.name} ({history.replacementItem.year})
                    </>
                  ) : (
                    "Na"
                  )}
                </TData>
                <TData>{history.useCount}</TData>
                <TData>{history.reason || "-"}</TData>
              </TRow>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination pageCount={Math.ceil(filteredHistories.length / itemsPerPage)} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default ItemUseHistoryTable;

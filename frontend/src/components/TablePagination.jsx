import React from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { setItemsPerPage } from "../features/itemsPerPagesSlice";

const TablePagination = ({ pageCount, onPageChange, currentPage }) => {
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const dispatch = useDispatch();

  const handlePageClick = (selectedItem) => {
    onPageChange(selectedItem);
  };

  const handleRowsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    dispatch(setItemsPerPage(newItemsPerPage));
    onPageChange({ selected: 0 }); // Reset to first page when changing rows per page
  };

  return (
    <div className="mt-4 flex justify-between items-center">
      <div>
        <label className="mr-2">Rows per Page:</label>
        <select value={itemsPerPage} onChange={handleRowsPerPageChange} className="p-2 border rounded">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      {pageCount > 0 && (
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center"}
          pageClassName={"mx-1"}
          pageLinkClassName={"px-4 py-2 border rounded text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none"}
          breakClassName={"mx-1"}
          breakLinkClassName={"px-4 py-2 border rounded text-blue-500 focus:outline-none"}
          activeClassName={"mx-1"}
          activeLinkClassName={"bg-blue-500 text-white"}
          disabledClassName={"text-gray-400 border-gray-400 cursor-not-allowed"}
          renderOnZeroPageCount={null}
          forcePage={currentPage}
        />
      )}
    </div>
  );
};

export default TablePagination;

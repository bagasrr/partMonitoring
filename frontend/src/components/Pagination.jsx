import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, handlePageClick, currentPage }) => {
  return (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={handlePageClick}
      containerClassName={"flex mt-5 justify-center"}
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
  );
};

export default Pagination;

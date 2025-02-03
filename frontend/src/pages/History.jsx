import React, { useEffect, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import SearchBar from "../components/SearchBar"; // Import SearchBar component
import highlightText from "../element/highlightText"; // Import highlightText function
import TablePagination from "../components/TablePagination";
import { useSelector } from "react-redux";
import { getHistories } from "../utils/histories";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const [selectedUuid, setSelectedUuid] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      const response = await getHistories();
      const sortedData = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistories(sortedData);
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    // console.log(`Page clicked: ${selected}`); // Logging for debugging
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0); // Reset page on search change
  };

  const handleShowDetail = (uuid) => {
    setSelectedUuid(uuid === selectedUuid ? null : uuid);
  };

  const filteredData = histories.filter((his) => his.name.toLowerCase().includes(search.toLowerCase()) || his.username.toLowerCase().includes(search.toLowerCase()) || formatDate(his.createdAt).toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  // console.log("Current items:", currentItems); // Logging to ensure displayed data

  // Reset currentPage if it exceeds pageCount
  useEffect(() => {
    if (currentPage > pageCount - 1 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [pageCount, currentPage]);

  // console.log(currentItems);
  return (
    <Layout key={currentPage}>
      <h1 className="text-2xl font-bold mb-10">History</h1>
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search history by name or date" />
      <div className="w-full">
        {currentItems.map((his) => (
          <div className="py-5 px-2 shadow-md my-2 hover:bg-slate-200" key={his.uuid} onClick={() => handleShowDetail(his.uuid)}>
            <div className="flex justify-between">
              <div className="flex items-baseline gap-2">
                <strong className="font-bold text-xl">{highlightText(his.name, search)}</strong>
                <p className="text-xs">telah dilakukan</p>
                <u>{highlightText(his.changeType, search)}</u>
              </div>
              <div className="flex flex-col items-end text-xs">
                <p>{highlightText(formatDate(his.createdAt), search)}</p>
                <p>
                  by <strong>{highlightText(his.username, search)}</strong>
                </p>
              </div>
            </div>
            <div className={`detail transition-max-height duration-300 ease-out ${selectedUuid === his.uuid ? "max-h-72" : "max-h-0"} overflow-hidden gap-3 flex`}>
              <div>
                <p>Aktor </p>
                <p>Name</p>
                <p>Tanggal Kejadian </p>
                {his.category != null && <p>Categori </p>}
                {his.prevStock != null && <p>Jumlah Sebelum </p>}
                {his.newStock != null && <p>Jumlah Baru </p>}
                {his.usedStock != null && <p>Jumlah Terpakai </p>}
                {his.afterStock != null && <p>Jumlah Akhir </p>}
                <p>Deskripsi </p>
              </div>
              <div className="font-bold">
                <p>: {highlightText(his.username, search)}</p>
                <p>: {highlightText(his.name, search)}</p>
                <p>: {highlightText(formatDate(his.createdAt), search)}</p>
                {his.category != null && <p>: {his.category}</p>}
                {his.prevStock != null && <p>: {his.prevStock}</p>}
                {his.newStock != null && <p>: {his.newStock}</p>}
                {his.usedStock != null && <p>: {his.usedStock}</p>}
                {his.afterStock != null && <p>: {his.afterStock}</p>}
                <p>: {his.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </Layout>
  );
};

export default History;

import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import Pagination from "../components/Pagination";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [selectedUuid, setSelectedUuid] = useState(null);

  useEffect(() => {
    getHistory();
  }, [currentPage]);

  const getHistory = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/history");
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistories(sortedData);
      console.log("Data fetched:", sortedData); // Logging untuk memastikan data terambil
    } catch (error) {
      console.log(error);
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
    console.log(`Page clicked: ${selected}`); // Logging untuk debugging
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowDetail = (uuid) => {
    setSelectedUuid(uuid === selectedUuid ? null : uuid);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = histories.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(histories.length / itemsPerPage);

  console.log("Current items:", currentItems); // Logging untuk memastikan data yang ditampilkan

  // Reset currentPage jika melebihi pageCount
  useEffect(() => {
    if (currentPage > pageCount - 1 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [pageCount, currentPage]);

  return (
    <Layout key={currentPage}>
      {" "}
      {/* Tambahkan key untuk force update */}
      <h1 className="text-2xl font-bold mb-10">History</h1>
      <div className="w-full">
        {currentItems.map((his) => (
          <div className="py-5 px-2 shadow-md my-2 hover:bg-slate-200" key={his.uuid} onClick={() => handleShowDetail(his.uuid)}>
            <div className="flex justify-between">
              <div className="flex items-baseline gap-2">
                <strong className="font-bold text-xl">{his.item.name}</strong>
                <p className="text-xs">telah dilakukan</p>
                <u>{his.changeType}</u>
              </div>
              <div className="flex flex-col items-end text-xs">
                <p>{formatDate(his.createdAt)}</p>
                <p>
                  by <strong>{his.user.name}</strong>
                </p>
              </div>
            </div>
            <div className={`detail transition-max-height duration-300 ease-out ${selectedUuid === his.uuid ? "max-h-72" : "max-h-0"} overflow-hidden gap-3 flex`}>
              <div>
                <p>Aktor </p>
                <p>Nama Part </p>
                <p>Tanggal Kejadian </p>
                <p>Jumlah Sebelum </p>
                <p>Jumlah Terpakai </p>
                <p>Jumlah Sisa </p>
                <p>Deskripsi </p>
              </div>
              <div className="font-bold">
                <p>: {his.user.name}</p>
                <p>: {his.item.name}</p>
                <p>: {formatDate(his.createdAt)}</p>
                <p>: {his.prevStock}</p>
                <p>: {his.usedStock}</p>
                <p>: {his.afterStock}</p>
                <p>: {his.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {pageCount > 0 && (
        <Pagination
          pageCount={pageCount}
          onPageChange={handlePageClick} // Menggunakan nama prop yang konsisten
          currentPage={currentPage}
        />
      )}
    </Layout>
  );
};

export default History;

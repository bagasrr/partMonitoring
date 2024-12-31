import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { TData, ThData, TRow } from "../element/Table";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/history");
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistories(sortedData);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = histories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(histories.length / itemsPerPage);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-10">History</h1>
      <div className="overflow-auto max-h-screen">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <ThData>Tanggal</ThData>
              <ThData>Change Type</ThData>
              <ThData>Item</ThData>
              <ThData>Machine</ThData>
              <ThData>Previous Stock</ThData>
              <ThData>Used Stock</ThData>
              <ThData>After Stock</ThData>
              <ThData>Description</ThData>
              <ThData>User</ThData>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((history) => (
              <TRow key={history.uuid}>
                <td className="text-sm font-bold text-center">{formatDate(history.createdAt)}</td>
                <TData>{history.changeType}</TData>
                <TData>{history.item.name}</TData>
                <TData>{history.machine.machine_name}</TData>
                <TData>{history.prevStock}</TData>
                <TData>{history.usedStock}</TData>
                <TData>{history.afterStock}</TData>
                <TData>{history.description}</TData>
                <TData>{history.user.name}</TData>
              </TRow>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}>
            {index + 1}
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default History;

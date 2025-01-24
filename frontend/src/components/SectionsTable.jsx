import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getSections } from "../utils/getSection";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import SearchBar from "./SearchBar"; // Import komponen SearchBar
import highlightText from "../element/highlightText"; // Import fungsi highlightText
import Pagination from "./Pagination"; // Import komponen Pagination
import useNotification from "../services/Notification"; // Importe useNotification
import TablePagination from "./TablePagination";

const SectionsTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSectionName, setSelectedSectionName] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(null);
  const notification = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSections();
  }, [notification, dispatch]);

  const fetchSections = async () => {
    const response = await getSections();
    setData(response);
  };

  const handleDelete = async () => {
    try {
      setShowModal(false);
      setDeleted(true);
      await axios.delete(`http://localhost:4000/api/sections/${selectedSection}`);
      dispatch(setNotification("Section Deleted"));
      fetchSections();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleOpenModal = (uuid, selected) => {
    setSelectedSectionName(selected);
    setSelectedSection(uuid);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const filteredData = data.filter((section) => section.section_name.toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>
      {notification && (
        <div className={`border ${deleted ? "bg-rose-100 border-rose-400 text-rose-700" : "bg-green-100  border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {notification}</span>
        </div>
      )}

      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search sections" />
      <div className="overflow-x-auto">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <ThData>No</ThData>
              <ThData>Nama Ruangan</ThData>
              <ThData>Nomor Ruangan</ThData>
              <ThData>Action</ThData>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
            {currentItems.map((section, index) => (
              <TRow key={section.uuid}>
                <TData>{index + 1 + indexOfFirstItem}</TData>
                <TData>{highlightText(section.section_name, search)}</TData>
                <TData>{section.section_number}</TData>
                <TData>
                  <div className="flex gap-5 items-center justify-center">
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(section.uuid, section.section_name)} />
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/sections/edit/${section.uuid}`)} />
                  </div>
                </TData>
              </TRow>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title="Apakah anda yakin ingin menghapus Ruangan ini?">
        <p>
          Jika menghapus Ruangan dengan Nama {<span className="text-red-500 text-2xl">{selectedSectionName}</span>} ini,maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan Ruangan ini akan{" "}
          <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>
      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default SectionsTable;

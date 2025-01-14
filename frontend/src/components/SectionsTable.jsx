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

const SectionsTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const itemsPerPage = 5; // Number of items per page
  const notification = useSelector((state) => state.notification.message); // Use Redux selector
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSections();
    // Clear notification after a few seconds
    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const fetchSections = async () => {
    const response = await getSections();
    setData(response);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/sections/${selectedSection}`);
    dispatch(setNotification("Section Deleted"));
    setShowModal(false);
    fetchSections(); // Refresh data after deletion
  };

  const handleOpenModal = (uuid) => {
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
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search sections" />
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
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(section.uuid)} />
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/sections/edit/${section.uuid}`)} />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
      {pageCount > 0 && <Pagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />}
      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title="Apakah anda yakin ingin menghapus Ruangan ini?">
        <p>
          Jika menghapus Ruangan ini,maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan Ruangan ini akan <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>
    </div>
  );
};

export default SectionsTable;

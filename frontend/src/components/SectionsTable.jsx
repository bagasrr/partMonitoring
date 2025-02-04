import React, { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer, TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { setDeleted, setNotification } from "../features/notificationSlice";
import { useNavigate } from "react-router-dom";
import { deleteSection, getSections } from "../utils/section";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import SearchBar from "./SearchBar"; // Import komponen SearchBar
import highlightText from "../element/highlightText"; // Import fungsi highlightText
import TablePagination from "./TablePagination";
import NotificationBar from "./NotificationBar";

const SectionsTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSectionName, setSelectedSectionName] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSections();
  }, [dispatch]);

  const fetchSections = async () => {
    const response = await getSections();
    setData(response);
  };

  const handleDelete = async () => {
    try {
      setShowModal(false);
      await deleteSection(selectedSection);
      dispatch(setNotification("Section Deleted"));
      dispatch(setDeleted(true));
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleSort = (column) => {
    let direction = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  const getSortIndicator = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return "";
  };

  const filteredData = useMemo(() => {
    return data.filter((section) => section.section_name.toLowerCase().includes(search.toLowerCase()) || section.section_number.toString().includes(search));
  }, [data, search]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (!sortConfig.key) return sorted;
    return sorted.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div>
      <NotificationBar />
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search sections" />
      <TableContainer>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <ThData>No</ThData>
              <ThData onClick={() => handleSort("section_name")}>
                <span className="flex justify-center">
                  Nama Ruangan
                  <span>{getSortIndicator("section_name")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("section_number")}>
                <span className="flex justify-center">
                  Nomor Ruangan
                  <span>{getSortIndicator("section_number")}</span>
                </span>
              </ThData>
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
      </TableContainer>
      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title="Apakah anda yakin ingin menghapus Ruangan ini?">
        <p>
          Jika menghapus Ruangan dengan Nama {<span className="text-red-500 text-2xl">{selectedSectionName}</span>} ini, maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan Ruangan ini akan{" "}
          <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>
      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default SectionsTable;

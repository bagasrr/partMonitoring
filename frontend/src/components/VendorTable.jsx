import React, { useEffect, useState, useMemo } from "react";
import { deleteVendor, getVendors } from "../utils/vendor";
import { TableContainer, TData, ThData, TRow } from "../element/Table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setDeleted, setNotification } from "../features/notificationSlice";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import SearchBar from "./SearchBar";
import highlightText from "../element/highlightText";
import TablePagination from "./TablePagination";
import NotificationBar from "./NotificationBar";

const VendorTable = () => {
  const { user } = useSelector((state) => state.auth);
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorName, setSelectedVendorName] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  useEffect(() => {
    fetchVendors();
  }, [dispatch]);

  const fetchVendors = async () => {
    const response = await getVendors();
    setData(response);
  };

  const handleDelete = async () => {
    try {
      setShowModal(false);
      await deleteVendor(selectedVendor);
      dispatch(setNotification(`Vendor ${selectedVendorName} Deleted`));
      dispatch(setDeleted(true));
      fetchVendors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (uuid, name) => {
    setSelectedVendor(uuid);
    setSelectedVendorName(name);
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
    return data.filter((vendor) => vendor.vendor_name.toLowerCase().includes(search.toLowerCase()));
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

  return (
    <div>
      <NotificationBar />
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search vendors" />
      <TableContainer>
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 z-10">
            <tr>
              <ThData>No</ThData>
              <ThData onClick={() => handleSort("vendor_name")}>
                <span className="flex justify-center">
                  Vendor Name
                  <span>{getSortIndicator("vendor_name")}</span>
                </span>
              </ThData>
              {user && user.role === "admin" && <ThData>Action</ThData>}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
            {currentItems.map((vendor, index) => (
              <TRow key={vendor.uuid}>
                <TData>{index + 1 + currentPage * itemsPerPage}</TData>
                <TData>{highlightText(vendor.vendor_name, search)}</TData>
                {user && user.role === "admin" && (
                  <TData>
                    <div className="flex gap-5 justify-center items-center">
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(vendor.uuid, vendor.vendor_name)} />
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.uuid}/edit`)} />
                    </div>
                  </TData>
                )}
              </TRow>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <DeleteConfirmModalBox show={showModal} onConfirm={handleDelete} onClose={handleCloseModal} title={`Are you sure to delete ${selectedVendorName}?`} />
      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default VendorTable;

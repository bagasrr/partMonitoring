import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getItems, getItemsBySection, getTypeReplaceitem, updateItemStatus } from "../utils/items"; // Updated import statement
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "../features/notificationSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import highlightText from "../element/highlightText";
import SearchBar from "./SearchBar";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import TablePagination from "./TablePagination";
import useNotification from "../services/Notification"; // Importe useNotification
import LoadingAnimate from "./LoadingAnimate";
import DetailsAction from "./DetailsAction";
import { FormatStatusColor } from "../utils/format";

const ItemsReplace = ({ section }) => {
  const [data, setData] = useState([]);
  const notification = useNotification(); // Panggil useNotification
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUUIDItem, setSelectedUUIDItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [notification, dispatch]);

  useEffect(() => {
    if (section.id === "") {
      fetchItems();
    }
    fetchItemsBySection();
  }, [section.id]);

  const fetchItems = async () => {
    const response = await getTypeReplaceitem();
    console.log(response);
    setData(response);
  };
  const fetchItemsBySection = async () => {
    if (!section.id) return;

    try {
      const response = await getItemsBySection(section.id, "Replace");
      setData(response.length ? response : []);
    } catch (error) {
      console.error("Error fetching items by section:", error);
      setData([]);
    }
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/items/${selectedUUIDItem}`);
    dispatch(setNotification("Items Deleted"));
    setShowModal(false);
    setDeleted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchItems();
  };

  const handleStatusChange = async (e, itemId) => {
    const newStatus = e.target.value;
    try {
      setIsLoading(true);
      await updateItemStatus(itemId, { status: newStatus });
      fetchItems(); // Refresh items after update
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating item status:", error);
    }
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.machine.machine_name.toLowerCase().includes(search.toLowerCase()));

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleSort = (column) => {
    let direction = "ascending";

    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...data].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      // Ambil nilai dari objek nested (vendor & machine)
      if (column === "vendor") {
        valA = a.vendor.vendor_name;
        valB = b.vendor.vendor_name;
      } else if (column === "machine") {
        valA = a.machine.machine_name;
        valB = b.machine.machine_name;
      }

      // Sorting teks atau angka
      if (valA < valB) return direction === "ascending" ? -1 : 1;
      if (valA > valB) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key: column, direction });
  };

  const getSortIndicator = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return "";
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handleOpenModal = (uuid, item) => {
    setSelectedItemName(item);
    setSelectedUUIDItem(uuid);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleClickRow = (item) => {
    setIsOpen(true);
    setSelectedItem(item);
  };

  return (
    <div className="w-full ">
      {isLoading && <LoadingAnimate isOpen={isLoading}>Please Wait Changing Status...</LoadingAnimate>}
      {notification && (
        <div className={`${deleted ? "bg-rose-100 border border-rose-400 text-rose-700" : "bg-green-100 border border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
          <span className="block sm:inline">{notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search parts or machines name" />
      <div className="overflow-auto min-w-full max-h-96 lg:max-h-[calc(100vh-150px)] ">
        <table className="w-full">
          <thead>
            <tr>
              <ThData>No</ThData>
              <ThData onClick={() => handleSort("name")}>
                <span className="flex gap-2 items-center justify-center w-full">
                  Name
                  <span>{getSortIndicator("name")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("amount")}>
                <span>
                  Amount
                  <span>{getSortIndicator("amount")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("status")}>
                <span>Status</span>
                <span>{getSortIndicator("status")}</span>
              </ThData>
              <ThData>Deskripsi</ThData>
              <ThData onClick={() => handleSort("lowerLimit")}>
                <span className="flex gap-2 items-center justify-between w-full">
                  Lower Limit
                  <span>{getSortIndicator("lowerLimit")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("machine")}>
                <span className="flex  items-center justify-between w-full">
                  Machine Name
                  <span>{getSortIndicator("machine")}</span>
                </span>
              </ThData>
              {user && user.role === "admin" && <ThData>Actions</ThData>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
            {currentItems.map((item, index) => (
              <TRow key={item.uuid} onClick={() => handleClickRow(item)}>
                <TData>{index + 1 + indexOfFirstItem}</TData>
                <TData>{highlightText(item.name, search)}</TData>
                <TData>{item.amount}</TData>
                <TData>
                  {user && user.role === "admin" ? (
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(e, item.uuid)}
                      className={`p-1 border border-gray-300 rounded text-center ${FormatStatusColor(item.status, "Broken", "Spare", "In Use", "Repair")}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Not Set" disabled>
                        Not Set
                      </option>
                      <option value="In Use">In Use</option>
                      <option value="Broken">Broken</option>
                      <option value="Repair">Repair</option>
                      <option value="Spare">Spare</option>
                    </select>
                  ) : (
                    <div className={`min-w-28 p-1 border border-gray-300 rounded text-center ${FormatStatusColor(item.status, "Broken", "Spare", "In Use", "Repair")}`}>{item.status}</div>
                  )}
                </TData>
                <TData>{item.description}</TData>
                <TData>{item.lowerLimit}</TData>
                <TData>{highlightText(item.machine.machine_name, search)}</TData>
                {user && user.role === "admin" && (
                  <TData>
                    <div className="flex gap-5 items-center">
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(item.uuid, item.name);
                        }}
                      />
                      <FaEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parts/${item.uuid}/edit`);
                        }}
                      />
                    </div>
                  </TData>
                )}
              </TRow>
            ))}
          </tbody>
        </table>

        <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title={`Apakah anda yakin ingin menghapus ${selectedItemName} ?`}></DeleteConfirmModalBox>
      </div>
      {isOpen && <DetailsAction data={selectedItem} setIsOpen={setIsOpen} />}

      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default ItemsReplace;

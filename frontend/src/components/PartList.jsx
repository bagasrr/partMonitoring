import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteItem, getItemType, getItemsBySection, updateItemStatus } from "../utils/items";
import { TableContainer, TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "../features/notificationSlice";
import { useNavigate } from "react-router-dom";
import highlightText from "../element/highlightText";
import SearchBar from "./SearchBar";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import TablePagination from "./TablePagination";
import useNotification from "../hooks/UseNotification";
import LoadingAnimate from "./LoadingAnimate";
import DetailsAction from "./DetailsAction";
import { FormatStatusColor } from "../utils/format";
import NotificationBar from "./NotificationBar";

const PartList = ({ section, type }) => {
  // State data dan cache internal berdasarkan tipe (misal: "Swap" atau "Replace")
  const [data, setData] = useState([]);
  const [cache, setCache] = useState({});

  const { user } = useSelector((state) => state.auth);
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedUUIDItem, setSelectedUUIDItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  // Fungsi untuk fetch data; jika data untuk tipe saat ini sudah ada dalam cache, gunakan data tersebut.
  const fetchItems = useCallback(async () => {
    // Jika tidak ada filter ruangan, ambil data umum
    if (section.id === "") {
      if (cache[type]) {
        setData(cache[type]);
      } else {
        const response = await getItemType(type);
        console.log("API Call for getItemType:", type);
        setData(response);
        setCache((prevCache) => ({ ...prevCache, [type]: response }));
      }
    }
  }, [type, section.id, cache]);

  // Jika ada filter ruangan (section.id tidak kosong), ambil data berdasarkan ruangan
  const fetchItemsBySection = useCallback(async () => {
    if (!section.id) return;
    try {
      const response = await getItemsBySection(section.id, type);
      setData(response.length ? response : []);
    } catch (error) {
      console.error("Error fetching items by section:", error);
      setData([]);
    }
  }, [section.id, type]);

  // Panggil fetchItems atau fetchItemsBySection saat komponen mount atau saat 'type' / 'section.id' berubah
  useEffect(() => {
    if (section.id === "") {
      fetchItems();
    } else {
      fetchItemsBySection();
    }
    // Reset halaman pencarian ketika tipe berubah
    setCurrentPage(0);
  }, [section.id, type, fetchItems, fetchItemsBySection, dispatch]);

  // Handle Delete: setelah delete, invalidasi cache untuk tipe ini dan refetch data
  const handleDelete = async () => {
    await deleteItem(selectedUUIDItem);
    dispatch(setNotification("Items Deleted"));
    dispatch(setDeleted(true));
    setShowModal(false);
    setDeleted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCache((prevCache) => ({ ...prevCache, [type]: null }));
    fetchItems();
  };

  // Update status dan invalidasi cache agar data terbaru diambil
  const handleStatusChange = async (e, itemId) => {
    const newStatus = e.target.value;
    try {
      setIsLoading(true);
      await updateItemStatus(itemId, { status: newStatus });
      setCache((prevCache) => ({ ...prevCache, [type]: null }));
      fetchItems();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating item status:", error);
    }
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  // Filter data berdasarkan search (apabila item.machine, item.item_number ada)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchLower = search.toLowerCase();
      return item.name.toLowerCase().includes(searchLower) || (item.machine && item.machine.machine_name.toLowerCase().includes(searchLower)) || (type === "Swap" && item.item_number && item.item_number.toLowerCase().includes(searchLower));
    });
  }, [data, search, type]);

  // Sorting: kita sort data berdasarkan kolom yang di-klik
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (!sortConfig.key) return sorted;
    return sorted.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Jika kolom merupakan nested object seperti vendor atau machine
      if (sortConfig.key === "vendor") {
        valA = a.vendor?.vendor_name || "";
        valB = b.vendor?.vendor_name || "";
      } else if (sortConfig.key === "machine") {
        valA = a.machine?.machine_name || "";
        valB = b.machine?.machine_name || "";
      }

      if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination: tentukan item yang akan ditampilkan berdasarkan halaman saat ini
  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (column) => {
    let direction = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sorted = [...data].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
      if (column === "vendor") {
        valA = a.vendor?.vendor_name || "";
        valB = b.vendor?.vendor_name || "";
      } else if (column === "machine") {
        valA = a.machine?.machine_name || "";
        valB = b.machine?.machine_name || "";
      }
      if (valA < valB) return direction === "ascending" ? -1 : 1;
      if (valA > valB) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setData(sorted);
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

  const handleOpenDeleteModal = (uuid, itemName) => {
    setSelectedItemName(itemName);
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
    <div className="overflow-hidden">
      {isLoading && <LoadingAnimate isOpen={isLoading}>Please Wait Changing Status...</LoadingAnimate>}
      <NotificationBar />
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search Parts Number Or Name or Machines Name" />
      <TableContainer>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <ThData>No</ThData>
              {type === "Swap" && (
                <ThData onClick={() => handleSort("item_number")}>
                  <span className="flex items-center justify-between w-full gap-1">
                    Part Number
                    <span>{getSortIndicator("item_number")}</span>
                  </span>
                </ThData>
              )}
              <ThData onClick={() => handleSort("name")}>
                <span className="flex justify-center">
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
              {type === "Swap" && (
                <>
                  <ThData onClick={() => handleSort("year")}>
                    <span className="flex gap-2 items-center justify-between w-full">
                      Year
                      <span>{getSortIndicator("year")}</span>
                    </span>
                  </ThData>
                  <ThData onClick={() => handleSort("vendor")}>
                    <span className="flex gap-2 items-center justify-center w-full">
                      Vendor
                      <span>{getSortIndicator("vendor")}</span>
                    </span>
                  </ThData>
                  <ThData onClick={() => handleSort("usage")}>Usage (Day) {getSortIndicator("usage")}</ThData>
                </>
              )}
              <ThData onClick={() => handleSort("machine")}>
                <span className="flex gap-2 items-center justify-center w-full">
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
                <td colSpan="10" className="text-center py-4">
                  No data found {section.name ? `for ${section.name}` : ""}
                </td>
              </tr>
            )}
            {currentItems.map((item, index) => (
              <TRow key={item.uuid} onClick={() => handleClickRow(item)}>
                <TData>{index + 1 + indexOfFirstItem}</TData>
                {type === "Swap" && <TData>{highlightText(item.item_number, search)}</TData>}
                <TData>{highlightText(item.name, search)}</TData>
                <TData>{item.amount}</TData>
                <TData>
                  {user && user.role === "admin" ? (
                    <select
                      value={item.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(e, item.uuid)}
                      className={`p-1 border border-gray-300 rounded text-center cursor-pointer ${FormatStatusColor(item.status, "Broken", "Spare", "In Use", "Repair")}`}
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
                {type === "Swap" && (
                  <>
                    <TData>{item.year}</TData>
                    <TData>{item.vendor?.vendor_name || "NA"}</TData>
                    <TData>{item.dayUsed !== null ? item.dayUsed : "0"}</TData>
                  </>
                )}
                <TData>{highlightText(item.machine.machine_name, search)}</TData>
                {user && user.role === "admin" && (
                  <TData>
                    <div className="flex gap-5 items-center">
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteModal(item.uuid, item.name);
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
      </TableContainer>
      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title={`Apakah anda yakin ingin menghapus ${selectedItemName} ?`} />
      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
      {isOpen && <DetailsAction data={selectedItem} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default PartList;

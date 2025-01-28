import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getTypeSwapItem, updateItemStatus } from "../utils/items"; // Updated import statement
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

const ItemsSwap = () => {
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
  const [deleted, setDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [notification, dispatch]);

  const fetchItems = async () => {
    const response = await getTypeSwapItem();
    console.log(response);
    setData(response);
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

  const getStatusColorClass = (status) => {
    switch (status) {
      case "In Use":
        return "bg-green-100 text-green-700";
      case "Broken":
        return "bg-red-100 text-red-700";
      case "Repair":
        return "bg-blue-100 text-blue-700";
      case "Spare":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-white text-gray-700";
    }
  };

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.machine.machine_name.toLowerCase().includes(search.toLowerCase()));

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

  return (
    <div className="overflow-hidden">
      {isLoading && <LoadingAnimate isOpen={isLoading}>Please Wait Changing Status...</LoadingAnimate>}
      {notification && (
        <div className={`${deleted ? "bg-rose-100 border border-rose-400 text-rose-700" : "bg-green-100 border border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
          <span className="block sm:inline">{notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search parts or machines name" />
      <div className="overflow-auto max-h-96 lg:max-h-[calc(100vh-150px)] ">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 z-10">
            <tr>
              <ThData>No</ThData>
              <ThData>Nama Part</ThData>
              <ThData>Amount</ThData>
              <ThData>Status</ThData>
              <ThData>Year</ThData>
              <ThData>Total Pemakaian (Hari)</ThData>
              <ThData>Deskripsi</ThData>
              <ThData>Batas Bawah</ThData>
              <ThData>Machine Name</ThData>
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
              <TRow key={item.uuid}>
                <TData>{index + 1 + indexOfFirstItem}</TData>
                <TData>{highlightText(item.name, search)}</TData>
                <TData>{item.amount}</TData>
                <TData>
                  {user && user.role === "admin" ? (
                    <select value={item.status} onChange={(e) => handleStatusChange(e, item.uuid)} className={`p-1 border border-gray-300 rounded text-center ${getStatusColorClass(item.status)}`}>
                      <option value="Not Set" disabled>
                        Not Set
                      </option>
                      <option value="In Use">In Use</option>
                      <option value="Broken">Broken</option>
                      <option value="Repair">Repair</option>
                      <option value="Spare">Spare</option>
                    </select>
                  ) : (
                    <div className={`min-w-28 p-1 border border-gray-300 rounded text-center ${getStatusColorClass(item.status)}`}>{item.status}</div>
                  )}
                </TData>
                <TData>{item.year}</TData>
                <TData>{item.dayUsed !== null ? item.dayUsed : "-"}</TData>
                <TData>{item.description}</TData>
                <TData>{item.lowerLimit}</TData>
                <TData>{highlightText(item.machine.machine_name, search)}</TData>
                {user && user.role === "admin" && (
                  <TData>
                    <div className="flex gap-5 items-center">
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(item.uuid, item.name)} />
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/parts/${item.uuid}/edit`)} />
                    </div>
                  </TData>
                )}
              </TRow>
            ))}
          </tbody>
        </table>
        <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title={`Apakah anda yakin ingin menghapus ${selectedItemName} ?`}></DeleteConfirmModalBox>
      </div>
      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
  // return (
  //   <div>
  //     {isLoading && <LoadingAnimate isOpen={isLoading}>Please Wait Changing Status...</LoadingAnimate>}
  //     {notification && (
  //       <div className={`${deleted ? "bg-rose-100 border border-rose-400 text-rose-700" : "bg-green-100 border border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
  //         <span className="block sm:inline">{notification}</span>
  //       </div>
  //     )}
  //     <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search parts or machines name" />
  //     <div className="overflow-x-auto lg:max-h-[calc(100vh-150px)]">
  //       <table className="min-w-full bg-white overflow-x-auto ">
  //         <thead className="sticky top-0 z-10">
  //           <tr>
  //             <ThData>No</ThData>
  //             <ThData>Nama Part</ThData>
  //             <ThData>Amount</ThData>
  //             <ThData>Status</ThData>
  //             <ThData>Year</ThData>
  //             <ThData>Total Pemakaian (Hari)</ThData>
  //             <ThData>Deskripsi</ThData>
  //             <ThData>Batas Bawah</ThData>
  //             <ThData>Machine Name</ThData>
  //             {user && user.role === "admin" && <ThData>Actions</ThData>}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {filteredData.length === 0 && (
  //             <tr>
  //               <td colSpan="8" className="text-center py-4">
  //                 No data found
  //               </td>
  //             </tr>
  //           )}
  //           {currentItems.map((item, index) => (
  //             <TRow key={item.uuid}>
  //               <TData>{index + 1 + indexOfFirstItem}</TData>
  //               <TData>{highlightText(item.name, search)}</TData>
  //               <TData>{item.amount}</TData>
  //               <TData>
  //                 {user && user.role === "admin" ? (
  //                   <select value={item.status} onChange={(e) => handleStatusChange(e, item.uuid)} className={`p-1 border border-gray-300 rounded text-center ${getStatusColorClass(item.status)}`}>
  //                     <option value="Not Set" disabled>
  //                       Not Set
  //                     </option>
  //                     <option value="In Use">In Use</option>
  //                     <option value="Broken">Broken</option>
  //                     <option value="Repair">Repair</option>
  //                     <option value="Spare">Spare</option>
  //                   </select>
  //                 ) : (
  //                   <div className={`min-w-28 p-1 border border-gray-300 rounded text-center ${getStatusColorClass(item.status)}`}>{item.status}</div>
  //                 )}
  //               </TData>
  //               <TData>{item.year}</TData>
  //               <TData>{item.dayUsed !== null ? item.dayUsed : "-"}</TData>
  //               <TData>{item.description}</TData>
  //               <TData>{item.lowerLimit}</TData>
  //               <TData>{highlightText(item.machine.machine_name, search)}</TData>
  //               {user && user.role === "admin" && (
  //                 <TData>
  //                   <div className="flex gap-5 items-center">
  //                     <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(item.uuid, item.name)} />
  //                     <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/parts/${item.uuid}/edit`)} />
  //                   </div>
  //                 </TData>
  //               )}
  //             </TRow>
  //           ))}
  //         </tbody>
  //       </table>

  //       <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title={`Apakah anda yakin ingin menghapus ${selectedItemName} ?`}></DeleteConfirmModalBox>
  //     </div>

  //     <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
  //   </div>
  // );
};

export default ItemsSwap;

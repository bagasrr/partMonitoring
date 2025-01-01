import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice"; // Import action
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getMachines } from "../utils/getMachine";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import SearchBar from "./SearchBar"; // Import komponen SearchBar
import highlightText from "../element/highlightText"; // Import fungsi highlightText
import Pagination from "./Pagination"; // Import komponen Pagination

const MachinesTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Menambah state untuk halaman saat ini
  const itemsPerPage = 5; // Jumlah item per halaman
  const notification = useSelector((state) => state.notification.message); // Gunakan selector Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Machines();
    // Hapus notifikasi setelah beberapa detik
    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const Machines = async () => {
    const response = await getMachines();
    setData(response);
  };

  const handleDelete = async () => {
    if (selectedMachine) {
      await axios.delete(`http://localhost:4000/api/machines/${selectedMachine}`);
      dispatch(setNotification("Machines Deleted"));
      setShowModal(false); // Tutup modal setelah penghapusan
      Machines(); // Refresh data setelah penghapusan
    }
  };

  const handleOpenModal = (uuid) => {
    setSelectedMachine(uuid);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  const filteredData = data.filter((machine) => machine.machine_name.toLowerCase().includes(search.toLowerCase()) || machine.section.section_name.toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={setSearch} placeholder="Search machines or sections" />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <ThData>No</ThData>
            <ThData>Nama Mesin</ThData>
            <ThData>No Mesin</ThData>
            <ThData>Ruangan</ThData>
            <ThData>No Ruangan</ThData>
            <ThData>Action</ThData>
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
          {currentItems.map((machine, index) => (
            <TRow key={machine.uuid}>
              <TData>{index + 1}</TData>
              <TData>{highlightText(machine.machine_name, search)}</TData>
              <TData>{machine.machine_number}</TData>
              <TData>{highlightText(machine.section.section_name, search)}</TData>
              <TData>{machine.section.section_number}</TData>
              <TData>
                <div className="flex gap-5 items-center justify-center">
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(machine.uuid)} />
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/machines/edit/${machine.uuid}`)} />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
      {pageCount > 0 && <Pagination pageCount={pageCount} handlePageClick={handlePageClick} forcePage={currentPage} />}
      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title="Apakah anda yakin ingin menghapus mesin ini?">
        <p>
          Jika menghapus mesin ini,maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan mesin ini akan <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>
    </div>
  );
};

export default MachinesTable;

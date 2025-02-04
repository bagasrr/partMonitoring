import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer, TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { setDeleted, setNotification } from "../features/notificationSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteMachines, getMachines } from "../utils/machines";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import SearchBar from "./SearchBar";
import highlightText from "../element/highlightText";
import useNotification from "../hooks/UseNotification"; // Importe useNotification
import TablePagination from "./TablePagination";

const MachinesTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const { notification, someDeleted } = useNotification();
  // const [deleted, setDeleted] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMachines();
  }, [notification, dispatch]);

  const fetchMachines = async () => {
    const response = await getMachines();
    setData(response);
  };

  const handleDelete = async () => {
    if (selectedMachine) {
      await deleteMachines(selectedMachine);
      window.scrollTo({ top: 0, behavior: "smooth" });

      dispatch(setNotification(`Machines ${selectedName} Deleted`));
      dispatch(setDeleted(true));
      setShowModal(false);
      fetchMachines();
    }
  };

  const handleOpenModal = (uuid, selected) => {
    setSelectedName(selected);
    setSelectedMachine(uuid);
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

  const filteredData = data.filter((machine) => machine.machine_name.toLowerCase().includes(search.toLowerCase()) || machine.section.section_name.toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>
      {notification && (
        <div className={`border ${someDeleted ? "bg-rose-100 border-rose-400 text-rose-700" : "bg-green-100  border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search machines or sections" />
      <TableContainer>
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 z-10">
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
                <TData>{index + 1 + indexOfFirstItem}</TData>
                <TData>{highlightText(machine.machine_name, search)}</TData>
                <TData>{machine.machine_number}</TData>
                <TData>{highlightText(machine.section.section_name, search)}</TData>
                <TData>{machine.section.section_number}</TData>
                <TData>
                  <div className="flex gap-5 items-center justify-center">
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(machine.uuid, machine.machine_name)} />
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/machines/${machine.uuid}/edit`)} />
                  </div>
                </TData>
              </TRow>
            ))}
          </tbody>
        </table>
      </TableContainer>

      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title="Apakah anda yakin ingin menghapus mesin ini?">
        <p>
          Jika menghapus mesin ini,maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan mesin ini akan <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>

      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default MachinesTable;

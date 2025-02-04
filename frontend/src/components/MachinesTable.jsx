import React, { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer, TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { setDeleted, setNotification } from "../features/notificationSlice";
import { useNavigate } from "react-router-dom";
import { deleteMachines, getMachines } from "../utils/machines";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import SearchBar from "./SearchBar";
import highlightText from "../element/highlightText";
import TablePagination from "./TablePagination";
import NotificationBar from "./NotificationBar";

const MachinesTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const [selectedName, setSelectedName] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMachines();
  }, [dispatch]);

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
    return data.filter(
      (machine) => machine.machine_name.toLowerCase().includes(search.toLowerCase()) || machine.section.section_name.toLowerCase().includes(search.toLowerCase()) || machine.section.section_number.toString().includes(search)
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (!sortConfig.key) return sorted;
    return sorted.sort((a, b) => {
      let valA = a;
      let valB = b;
      for (const key of sortConfig.key.split(".")) {
        valA = valA[key];
        valB = valB[key];
      }
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
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search machines or sections" />
      <TableContainer>
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 z-10">
            <tr>
              <ThData>No</ThData>
              <ThData onClick={() => handleSort("machine_name")}>
                <span className="flex justify-center">
                  Machine Name
                  <span>{getSortIndicator("machine_name")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("machine_number")}>
                <span className="flex justify-center">
                  Machine Number
                  <span>{getSortIndicator("machine_number")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("section.section_name")}>
                <span className="flex justify-center">
                  Section Name
                  <span>{getSortIndicator("section.section_name")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("section.section_number")}>
                <span className="flex justify-center">
                  Section Number
                  <span>{getSortIndicator("section.section_number")}</span>
                </span>
              </ThData>
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
          Jika menghapus mesin ini, maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan mesin ini akan <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>

      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default MachinesTable;

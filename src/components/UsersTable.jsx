import React, { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer, TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { setDeleted, setNotification } from "../features/notificationSlice";
import { useNavigate } from "react-router-dom";
import { deleteUser, getUsers } from "../utils/users";
import SearchBar from "./SearchBar"; // Import komponen SearchBar
import TablePagination from "./TablePagination"; // Import komponen TablePagination
import highlightText from "../element/highlightText"; // Import fungsi highlightText
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";
import NotificationBar from "./NotificationBar";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const itemsPerPage = useSelector((state) => state.itemsPerPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState({
    modal: false,
  });
  const [selected, setSelected] = useState({
    userName: "",
    userId: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    const response = await getUsers();
    setData(response);
  };

  const handleDelete = async () => {
    await deleteUser(selected.userId);
    setShow({ modal: false });
    dispatchDeleteNotif();
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchUsers(); // Refresh data after deletion
  };

  const dispatchDeleteNotif = () => {
    dispatch(setDeleted(true));
    dispatch(setNotification("User Deleted"));
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  const handleOpenDeleteModal = (uuid, name) => {
    setSelected({
      userName: name,
      userId: uuid,
    });
    setShow({ modal: true });
  };

  const handleCloseDeleteModal = () => {
    setShow({ modal: false });
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
    return data.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase()) || (user.email && user.email.toLowerCase().includes(search.toLowerCase())));
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
    <div className="flex flex-col gap-5">
      <NotificationBar />
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search users" />
      <TableContainer>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <ThData>No</ThData>
              <ThData onClick={() => handleSort("name")}>
                <span className="flex justify-center">
                  Nama
                  <span>{getSortIndicator("name")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("role")}>
                <span className="flex justify-center">
                  Role
                  <span>{getSortIndicator("role")}</span>
                </span>
              </ThData>
              <ThData onClick={() => handleSort("email")}>
                <span className="flex justify-center">
                  Email
                  <span>{getSortIndicator("email")}</span>
                </span>
              </ThData>
              <ThData>Action</ThData>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No data found
                </td>
              </tr>
            )}
            {currentItems.map((user, index) => (
              <TRow key={user.uuid}>
                <TData>{currentPage * itemsPerPage + index + 1}</TData>
                <TData>{highlightText(user.name, search)}</TData>
                <TData>{highlightText(user.role, search)}</TData>
                <TData>{user.email || "NA"}</TData>
                <TData>
                  <div className="flex gap-5 items-center justify-center">
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenDeleteModal(user.uuid, user.name)} />
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/users/edit/${user.uuid}`)} />
                  </div>
                </TData>
              </TRow>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <DeleteConfirmModalBox show={show.modal} onClose={handleCloseDeleteModal} onConfirm={handleDelete} title={`Apakah anda yakin ingin menghapus ${selected.userName} ?`} />
      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default UsersTable;

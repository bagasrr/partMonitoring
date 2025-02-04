import React, { useEffect, useState } from "react";
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

  const filteredData = data.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
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
              <ThData>Nama</ThData>
              <ThData>Role</ThData>
              <ThData>Email</ThData>
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
            {currentItems.map((user, index) => (
              <TRow key={user.uuid}>
                <TData>{indexOfFirstItem + index + 1}</TData>
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

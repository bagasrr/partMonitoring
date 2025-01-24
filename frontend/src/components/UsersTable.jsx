import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/users";
import SearchBar from "./SearchBar"; // Import komponen SearchBar
import TablePagination from "./TablePagination"; // Import komponen TablePagination
import highlightText from "../element/highlightText"; // Import fungsi highlightText

const UsersTable = () => {
  const [data, setData] = useState([]);
  const notification = useSelector((state) => state.notification.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const fetchUsers = async () => {
    const response = await getUsers();
    setData(response);
  };

  const handleDelete = async (uuid) => {
    await axios.delete(`http://localhost:4000/api/users/${uuid}`);
    dispatch(setNotification("User Deleted"));
    fetchUsers(); // Refresh data after deletion
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  const filteredData = data.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase()));

  const itemsPerPage = 5; // Default value
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-5">
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={handleSearchChange} placeholder="Search users" />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <ThData>No</ThData>
              <ThData>Nama</ThData>
              <ThData>Role</ThData>
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
                <TData>
                  <div className="flex gap-5 items-center justify-center">
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(user.uuid)} />
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/users/edit/${user.uuid}`)} />
                  </div>
                </TData>
              </TRow>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
    </div>
  );
};

export default UsersTable;

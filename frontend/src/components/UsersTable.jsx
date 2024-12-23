import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllItem } from "../utils/getItem";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice"; // Import action
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/getUser";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const notification = useSelector((state) => state.notification.message); // Gunakan selector Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Users();
    // Hapus notifikasi setelah beberapa detik
    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const Users = async () => {
    const response = await getUsers();
    setData(response);
  };
  const handleDelete = async (uuid) => {
    await axios.delete(`http://localhost:4000/api/users/${uuid}`);
    dispatch(setNotification("User Deleted"));
  };

  return (
    <div className="overflow-x-auto">
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {notification}</span>
        </div>
      )}
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
          {data.map((user, index) => (
            <TRow key={user.uuid}>
              <TData>{index + 1}</TData>
              <TData>{user.name}</TData>
              <TData>{user.role}</TData>
              <TData>
                <div className="flex gap-5 items-center">
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(user.uuid)} />
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/users/edit/${user.uuid}`)} />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

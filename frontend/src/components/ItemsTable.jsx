import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllItem } from "../utils/getItem";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import highlightText from "../element/highlightText";

const ItemsTable = () => {
  const [data, setData] = useState([]);
  const notification = useSelector((state) => state.notification.message);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    items();

    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const items = async () => {
    const response = await getAllItem();
    setData(response);
  };

  const handleDelete = async (uuid) => {
    await axios.delete(`http://localhost:4000/api/items/${uuid}`);
    dispatch(setNotification("Items Deleted"));
    items();
  };

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.machine.machine_name.toLowerCase().includes(search.toLowerCase()));

  console.log(filteredData.length);
  return (
    <div className="overflow-x-auto">
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {notification}</span>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Search items or machines"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <ThData>No</ThData>
            <ThData>Nama Item</ThData>
            <ThData>Stok</ThData>
            {user && user.role === "admin" && (
              <>
                <ThData>Username</ThData>
                <ThData>Role</ThData>
              </>
            )}
            <ThData>Machine Name</ThData>
            <ThData>Machine Number</ThData>
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
          {filteredData &&
            filteredData.map((item, index) => (
              <TRow key={item.uuid}>
                <TData>{index + 1}</TData>
                <TData>{highlightText(item.name, search)}</TData>
                <TData>{item.stok}</TData>
                {user && user.role === "admin" && (
                  <>
                    <TData>{item.user.name}</TData>
                    <TData>{item.user.role}</TData>
                  </>
                )}
                <TData>{highlightText(item.machine.machine_name, search)}</TData>
                <TData>{item.machine.machine_number}</TData>
                {user && user.role === "admin" && (
                  <TData>
                    <div className="flex gap-5 items-center">
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(item.uuid)} />
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/items/edit/${item.uuid}`)} />
                    </div>
                  </TData>
                )}
              </TRow>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;

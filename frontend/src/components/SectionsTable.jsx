import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllItem } from "../utils/getItem";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice"; // Import action
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/getUser";
import { getSections } from "../utils/getSection";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";

const SectionsTable = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const notification = useSelector((state) => state.notification.message); // Gunakan selector Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Sections();
    // Hapus notifikasi setelah beberapa detik
    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const Sections = async () => {
    const response = await getSections();
    setData(response);
  };
  const handleDelete = async () => {
    await axios.delete(`http://localhost:4000/api/sections/${selectedSection}`);
    dispatch(setNotification("Sections Deleted"));
    setShowModal(false);
  };

  const handleOpenModal = (uuid) => {
    setSelectedSection(uuid);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
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
            <ThData>Nama Ruangan</ThData>
            <ThData>Nomor Ruangan</ThData>
            <ThData>Action</ThData>
          </tr>
        </thead>
        <tbody>
          {data.map((section, index) => (
            <TRow key={section.uuid}>
              <TData>{index + 1}</TData>
              <TData>{section.section_name}</TData>
              <TData>{section.section_number}</TData>
              <TData>
                <div className="flex gap-5 items-center justify-center">
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleOpenModal(section.uuid)} />
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/sections/edit/${section.uuid}`)} />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
      <DeleteConfirmModalBox show={showModal} onClose={handleCloseModal} onConfirm={handleDelete} title="Apakah anda yakin ingin menghapus Ruangan ini?">
        <p>
          Jika menghapus Ruangan ini,maka<span className="text-red-500 text-2xl"> semua data </span> yang berkaitan dengan Ruangan ini akan <span className="text-red-500 text-2xl"> terhapus.</span>
        </p>
      </DeleteConfirmModalBox>
    </div>
  );
};

export default SectionsTable;

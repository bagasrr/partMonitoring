import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllItem } from "../utils/getItem";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice"; // Import action
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getMachines } from "../utils/getMachine";
import { Button } from "../element/Input";

const MachinesTable = () => {
  const [data, setData] = useState([]);
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
    console.log(response);
    setData(response);
  };
  const handleDelete = async (uuid) => {
    await axios.delete(`http://localhost:4000/api/machines/${uuid}`);
    dispatch(setNotification("Machines Deleted"));
  };

  return (
    <div>
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
            <ThData>Nama Mesin</ThData>
            <ThData>No Mesin</ThData>
            <ThData>Ruangan</ThData>
            <ThData>No Ruangan</ThData>
            <ThData>Action</ThData>
          </tr>
        </thead>
        <tbody>
          {data.map((machine, index) => (
            <TRow key={machine.uuid}>
              <TData>{index + 1}</TData>
              <TData>{machine.machine_name}</TData>
              <TData>{machine.machine_number}</TData>
              <TData>{machine.section.section_name}</TData>
              <TData>{machine.section.section_number}</TData>
              <TData>
                <div className="flex gap-5 items-center justify-center">
                  {/* <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(machine.uuid)} /> */}
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => (
                      <div className="fixed top-0 w-full bg-white shadow-md z-20 flex gap-5 items-center justify-center">
                        <h1>Are you sure?</h1>
                        <button onClick={() => handleDelete(machine.uuid)}>Yes</button>
                        <button>No</button>
                      </div>
                    )}
                  />
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/machines/edit/${machine.uuid}`)} />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MachinesTable;

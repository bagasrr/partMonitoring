import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllItem } from "../utils/getItem";
import { TData, ThData, TRow } from "../element/Table";

const ItemsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    items();
  }, []);

  const items = async () => {
    const response = await getAllItem();
    setData(response);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <ThData>No</ThData>
            <ThData>Nama</ThData>
            <ThData>Stok</ThData>
            <ThData>Username</ThData>
            <ThData>Role</ThData>
            <ThData>Actions</ThData>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TRow key={item.uuid}>
              <TData>{index + 1}</TData>
              <TData>{item.name}</TData>
              <TData>{item.stok}</TData>
              <TData>{item.user.name}</TData>
              <TData>{item.user.role}</TData>
              <TData>
                <div className="flex gap-5 items-center">
                  <FaTrash className="text-red-500" />
                  <FaEdit className="text-blue-500" />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;

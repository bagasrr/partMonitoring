import React, { useEffect, useState } from "react";
import { deleteVendor, getVendors } from "../utils/vendor";
import { TData, ThData, TRow } from "../element/Table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModalBox from "./DeleteConfirmModalBox";

const VendorTable = () => {
  const { user } = useSelector((state) => state.auth);
  const [list, setList] = useState({
    vendor: [],
  });
  const [openModal, setOpenModal] = useState({
    delete: false,
  });
  const [selected, setSelected] = useState({
    uuid: "",
    name: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);
  const fetchVendors = async () => {
    try {
      const response = await getVendors();
      console.log(response);
      setList({ vendor: response });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (uuid) => {
    try {
      setOpenModal({ delete: false });
      await deleteVendor(uuid);
      fetchVendors();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteModal = (uuid, name) => {
    setOpenModal({
      delete: true,
    });
    console.log(openModal.delete);
    setSelected({
      uuid,
      name,
    });
  };
  return (
    <div>
      <table className="w-full">
        <thead className="sticky top-0 z-10">
          <TRow>
            <ThData>No</ThData>
            <ThData>Vendor Name</ThData>
            <ThData>Action</ThData>
          </TRow>
        </thead>
        <tbody>
          {list.vendor.map((vendor, index) => (
            <TRow key={vendor.uuid}>
              <TData>{index + 1}</TData>
              <TData>{vendor.vendor_name}</TData>
              {user && user.role === "admin" && (
                <TData>
                  <div className="flex gap-5 justify-center items-center">
                    <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(vendor.uuid, vendor.vendor_name)} />
                    <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/vendors/${item.uuid}/edit`)} />
                  </div>
                </TData>
              )}
            </TRow>
          ))}
        </tbody>
      </table>
      <DeleteConfirmModalBox show={openModal.delete} onConfirm={() => handleDelete(selected.uuid)} onClose={() => setOpenModal({ delete: false })} title={`Are you sure to Delete ${selected.name}?`} />
    </div>
  );
};

export default VendorTable;

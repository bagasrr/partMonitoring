import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminArea } from "../../utils/adminArea";
import { Label, NormalInput } from "../../element/Input";
import { getSections } from "../../utils/getSection";
import FormLayout from "../FormLayout";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import useNotification from "../../services/Notification";

const AddMachine = () => {
  adminArea();
  const navigate = useNavigate();
  const [machineName, setMachineName] = useState("");
  const [machineNumber, setMachineNumber] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [isNewMachine, setIsNewMachine] = useState(false);
  const dispatch = useDispatch();
  const notification = useNotification();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/machines", {
        machine_name: machineName,
        machine_number: machineNumber,
        section_name: sectionName,
        section_number: sectionNumber,
      });
      navigate("/machines");
    } catch (error) {
      console.log(error.response);
      dispatch(setNotification(error.response.data.message));
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSectionByName = async (sectionName) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/sections?section_name=${sectionName}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSection = async () => {
    const response = await getSections();
    console.log(response);
    setSectionData(response);
  };
  return (
    <FormLayout formTitle={"Tambah Mesin"} onSubmit={handleSubmit}>
      {notification && <p className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded relative mb-4">{notification}</p>}
      <NormalInput label="Nama Mesin" id="machineName" type="text" onChange={(e) => setMachineName(e.target.value)} placeholder="Masukkan Nama Mesin" />
      <NormalInput label="Nomor Mesin" id="machineNumber" type="text" onChange={(e) => setMachineNumber(e.target.value)} placeholder="Masukkan Nomor Mesin" />

      <div className="mb-4 flex flex-col">
        <Label htmlFor="sectionName">Pilih Ruangan</Label>
        <select
          id="sectionName"
          name="sectionName"
          value={isNewMachine ? "new" : sectionName}
          onChange={(e) => {
            if (e.target.value === "new") {
              setIsNewMachine(true);
              setSectionName("");
            } else {
              setIsNewMachine(false);
              setSectionName(e.target.value);
              console.log(e.target.value);
            }
          }}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Pilih Section</option>
          {sectionData &&
            sectionData.map((section) => (
              <option key={section.uuid} value={section.section_name}>
                {section.section_name}
              </option>
            ))}
          <option value="new">Enter New Section</option>
        </select>
        {isNewMachine && <NormalInput id="sectionName" type="text" onChange={(e) => setSectionName(e.target.value)} placeholder="Masukkan Nama Section" />}
      </div>
      {isNewMachine && <NormalInput label="Nomor Ruangan" id="sectionNumber" type="text" onChange={(e) => setSectionNumber(e.target.value)} placeholder="Masukkan Nomor Ruangan" />}
    </FormLayout>
  );
};

export default AddMachine;

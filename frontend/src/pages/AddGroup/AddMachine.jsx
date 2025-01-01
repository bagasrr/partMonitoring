import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminArea } from "../../utils/adminArea";
import Title from "../../element/Title";
import { Button, Label, NormalInput } from "../../element/Input";
import Layout from "../Layout";
import { getSections } from "../../utils/getSection";

const AddMachine = () => {
  adminArea();
  const navigate = useNavigate();
  const [machineName, setMachineName] = useState("");
  const [machineNumber, setMachineNumber] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [isNewMachine, setIsNewMachine] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Machine : ", machineName);
    console.log("Machine Number : ", machineNumber);
    console.log("Section : ", sectionName);
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
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    const response = await getSections();
    setSectionData(response);
  };
  console.log(sectionName);
  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <Title>Tambah Mesin</Title>
        <form onSubmit={handleSubmit}>
          <NormalInput label="Nama Mesin" id="machineName" type="text" onChange={(e) => setMachineName(e.target.value)} placeholder="Masukkan Nama Mesin" />
          <NormalInput label="Nomor Mesin" id="machineNumber" type="text" onChange={(e) => setMachineNumber(e.target.value)} placeholder="Masukkan Nomor Mesin" />

          <div className=" flex flex-col">
            <Label htmlFor="sectionName">Pilih Section</Label>
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

          <NormalInput label="Nomor Ruangan" id="sectionNumber" type="text" onChange={(e) => setSectionNumber(e.target.value)} placeholder="Masukkan Nomor Ruangan" />
          <Button type="submit">Tambahkan</Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddMachine;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../features/notificationSlice";
import axios from "axios";
import Layout from "./Layout";
import ItemInput from "../components/ItemInput";
import MachineInput from "../components/MachineInput";
import { Button, Label, NormalInput, StokInput, TextArea } from "../element/Input";
import { getSections } from "../utils/getSection";

const AddItemForm = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [names, setNames] = useState([]);
  const [isNewName, setIsNewName] = useState(false);
  const [machine, setMachine] = useState("");
  const [machineNumber, setMachineNumber] = useState("");
  const [machines, setMachines] = useState([]);
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [isNewSection, setIsNewSection] = useState(false);

  const [desc, setDesc] = useState("");
  const [isNewMachine, setIsNewMachine] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchItems();
    fetchMachines();
    fetchSections();
  }, []);

  const fetchItems = async () => {
    const items = await axios.get("http://localhost:4000/api/items");
    const itemNames = items.data.map((item) => item.name);
    setNames(itemNames);
  };

  const fetchMachines = async () => {
    const response = await axios.get("http://localhost:4000/api/machines");
    setMachines(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    if (names.length > 0 && machines.length > 0) {
      const matchingMachine = machines.find((machine) => names.includes(machine.name));
      if (matchingMachine) {
        setMachine(matchingMachine.name);
      }
    }
  }, [names, machines]);

  const fetchSections = async () => {
    const response = await getSections();
    setSections(response);
  };

  const handleSectionChange = (e) => {
    if (e.target.value === "new") {
      setIsNewSection(true);
      setSection("");
    } else {
      setIsNewSection(false);
      setSection(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/items", {
      name,
      stok: parseInt(stock),
      machine_name: machine,
      machine_number: machineNumber,
      section_name: section,
      lowerLimit: parseInt(minStock),
      section_number: sectionNumber,
      description: desc,
    });
    dispatch(setNotification("Items Added"));
    navigate("/items");
  };

  return (
    <Layout>
      <div className={`${isNewMachine ? "w-fit" : "w-1/2"} mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col items-center `}>
        <h1 className="text-2xl font-bold text-center mb-4">Tambahkan Part Baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-10">
            <div>
              <ItemInput label="Part Name" name={name} names={names} isNewName={isNewName} setName={setName} setIsNewName={setIsNewName} />
              <StokInput name="stock" setStock={setStock} />
              <StokInput label="Min Stock" name="minStock" setStock={minStock} />
              <TextArea label="Deskripsi" value={desc} id="desc" onChange={(e) => setDesc(e.target.value)} placeholder={"Masukkan Deskripsi"} />

              <MachineInput machine={machine} machines={machines} isNewMachine={isNewMachine} setMachine={setMachine} setIsNewMachine={setIsNewMachine} user={user} />
              {isNewMachine && <NormalInput label="Nomor Mesin" id="machineNumber" type="text" onChange={(e) => setMachineNumber(e.target.value)} placeholder="Masukkan Nomor Mesin" />}
            </div>
            {isNewMachine && (
              <div>
                <div className="flex flex-col">
                  <Label htmlFor="sectionName">Pilih Section</Label>
                  <select
                    id="sectionName"
                    name="sectionName"
                    value={isNewSection ? "new" : section}
                    onChange={handleSectionChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="" disabled>
                      Pilih Section
                    </option>
                    {sections.map((section) => (
                      <option key={section.uuid} value={section.section_name}>
                        {section.section_name}
                      </option>
                    ))}
                    <option value="new">Enter New Section</option>
                  </select>
                  {isNewSection && <NormalInput id="sectionName" type="text" onChange={(e) => setSection(e.target.value)} placeholder="Masukkan Nama Section" />}
                </div>
                {isNewSection && <NormalInput label="Nomor Ruangan" id="sectionNumber" type="text" onChange={(e) => setSectionNumber(e.target.value)} placeholder="Masukkan Nomor Ruangan" />}
              </div>
            )}
          </div>
          <Button type="submit">Tambahkan</Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddItemForm;

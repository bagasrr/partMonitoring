import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import axios from "axios";
import Layout from "../Layout";
import { Button, NormalInput, OptionInput, TextArea } from "../../element/Input";
import FormLayout from "../FormLayout";

const AddPart = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
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
      section_number: sectionNumber,
      description: desc,
    });
    dispatch(setNotification("Items Added"));
    navigate("/items");
  };

  return (
    <FormLayout formTitle={"Tambah Part"} onSubmit={handleSubmit}>
      <OptionInput label="Machine" id="machine" options={items.map((machine) => machine.name)} onSelectOption={setMachine} />
      <NormalInput label="Stok Part" id="stock" type="text" onChange={(e) => setStock(e.target.value)} />
      <TextArea label="Description" id="desc" type="text" onChange={(e) => setDesc(e.target.value)} />
    </FormLayout>
  );
};

export default AddPart;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../features/notificationSlice";
import axios from "axios";
import Layout from "./Layout";
import ItemInput from "../components/ItemInput";
import MachineInput from "../components/MachineInput";
import { NormalInput } from "../element/Input";

const AddItemForm = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [names, setNames] = useState([]);
  const [isNewName, setIsNewName] = useState(false);
  const [machine, setMachine] = useState("");
  const [machines, setMachines] = useState([]);
  const [desc, setDesc] = useState("");
  const [isNewMachine, setIsNewMachine] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchItems();
    fetchMachines();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/items", {
      name,
      stok: parseInt(stock),
      machine_name: machine,
      description: desc,
    });
    dispatch(setNotification("Items Added"));
    navigate("/items");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Tambahkan Part</h1>
        <form onSubmit={handleSubmit}>
          <ItemInput label="Part Name" name={name} names={names} isNewName={isNewName} setName={setName} setIsNewName={setIsNewName} />
          <MachineInput machine={machine} machines={machines} isNewMachine={isNewMachine} setMachine={setMachine} setIsNewMachine={setIsNewMachine} user={user} />
          <NormalInput label="Stok" value={stock} type="number" id="stock" onChange={(e) => setStock(e.target.value)} placeholder={"Masukkan Stok"} />

          <div className="my-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Deskripsi
            </label>
            <textarea id="description" name="description" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Deskripsi" onChange={(e) => setDesc(e.target.value)} />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Tambahkan
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddItemForm;

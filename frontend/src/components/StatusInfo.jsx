import React, { useEffect, useState } from "react";
import Title from "../element/Title";
import { getBrokenItems, getInUseItems, getRepairItems, getSpareItems } from "../utils/items";

const StatusInfo = () => {
  const [spare, setSpare] = useState([]);
  const [broken, setBroken] = useState([]);
  const [inUse, setInUse] = useState([]);
  const [repair, setRepair] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const spare = await getSpareItems();
    const broken = await getBrokenItems();
    const inUse = await getInUseItems();
    const repair = await getRepairItems();
    setSpare(spare);
    setBroken(broken);
    setInUse(inUse);
    setRepair(repair);
  };

  const openModal = (items, title) => {
    setSelectedItems(items);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div onClick={() => openModal(spare, "Spares")} className="bg-white shadow rounded-lg p-6 cursor-pointer">
        <h2 className="text-xl font-bold mb-4">Spares</h2>
        <div className="text-2xl font-semibold text-green-500">{spare && spare.length}</div>
      </div>
      <div onClick={() => openModal(broken, "Broken")} className="bg-white shadow rounded-lg p-6 cursor-pointer">
        <h2 className="text-xl font-bold mb-4">Broken</h2>
        <div className="text-2xl font-semibold text-red-500">{broken && broken.length}</div>
      </div>
      <div onClick={() => openModal(inUse, "In Use")} className="bg-white shadow rounded-lg p-6 cursor-pointer">
        <h2 className="text-xl font-bold mb-4">In Use</h2>
        <div className="text-2xl font-semibold text-blue-500">{inUse && inUse.length}</div>
      </div>
      <div onClick={() => openModal(repair, "Repair")} className="bg-white shadow rounded-lg p-6 cursor-pointer">
        <h2 className="text-xl font-bold mb-4">Repair</h2>
        <div className="text-2xl font-semibold text-yellow-500">{repair && repair.length}</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modalTitle}</h3>
              <button onClick={closeModal} className="text-red-500 font-bold">
                &times;
              </button>
            </div>
            <div>
              {selectedItems.length > 0 ? (
                <ul>
                  {selectedItems.map((item) => (
                    <li key={item.uuid} className="mb-2">
                      {item.name} ({item.year})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusInfo;

import React, { useEffect, useState } from "react";
import Title from "../element/Title";
import { getBrokenItems, getInUseItems, getRepairItems, getSpareItems } from "../utils/items";
import InfoBox from "./InfoBox"; // Import komponen InfoBox

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Menggunakan komponen InfoBox */}
      <InfoBox title="Spares" count={spare.length} color="text-green-500" onClick={() => openModal(spare, "Spares")} />
      <InfoBox title="Broken" count={broken.length} color="text-red-500" onClick={() => openModal(broken, "Broken")} />
      <InfoBox title="In Use" count={inUse.length} color="text-blue-500" onClick={() => openModal(inUse, "In Use")} />
      <InfoBox title="Repair" count={repair.length} color="text-yellow-500" onClick={() => openModal(repair, "Repair")} />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
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

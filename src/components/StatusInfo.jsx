import { useState } from "react";
import InfoBox from "./InfoBox"; // Import komponen InfoBox

const StatusInfo = ({ statusData }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <InfoBox title="Spares" count={statusData.spare.length} color="text-green-500" onClick={() => openModal(statusData.spare, "Spares")} />
      <InfoBox title="Broken" count={statusData.broken.length} color="text-red-500" onClick={() => openModal(statusData.broken, "Broken")} />
      <InfoBox title="In Use" count={statusData.inUse.length} color="text-blue-500" onClick={() => openModal(statusData.inUse, "In Use")} />
      <InfoBox title="Repair" count={statusData.repair.length} color="text-yellow-500" onClick={() => openModal(statusData.repair, "Repair")} />

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
                      {item.item_number ? "[" + item.item_number + "]" : ""} {item.name} {item.year && "(" + item.year + " )"} - {item.machine.machine_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No part found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusInfo;

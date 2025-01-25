import { changeItem, getItems } from "../../utils/items";
import FormField from "../FormField";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";

const SwapPartForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedReplaceItem, setSelectedReplaceItem] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    itemName: "",
    replaceItemName: "",
    itemStartUseDate: "",
    itemEndUseDate: "",
    machineName: "",
    reason: "",
    itemYear: "",
    replaceItemYear: "",
    itemStatus: "",
    useAmount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (e) => {
    const [name, year] = e.target.value.split(" - ");
    const item = items.find((item) => item.name === name && item.year.toString() === year);
    if (item) {
      setSelectedItem(item);
      setFormData({
        ...formData,
        itemName: item.name,
        itemYear: item.year,
      });
      console.log("Item selected: ", item); // Add this line
    } else {
      setSelectedItem(null);
      setFormData({
        ...formData,
        itemName: "",
        itemYear: "",
      });
    }
  };

  const handleReplaceItemChange = (e) => {
    const value = e.target.value;
    const [name, year] = value.split(" - ");
    const replaceItem = items.find((item) => item.name === name && item.year.toString() === year);
    if (replaceItem) {
      setSelectedReplaceItem(replaceItem);
      setFormData({ ...formData, replaceItemName: replaceItem.name, replaceItemYear: replaceItem.year, machineName: replaceItem.machine.machine_name });
      console.log("Replace item selected: ", replaceItem); // Add this line
    } else {
      setSelectedReplaceItem(null);
      setFormData({ ...formData, replaceItemName: "", replaceItemYear: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeItem(formData);
      dispatch(setNotification(`${formData.itemName} - ${formData.itemYear} Swap to ${formData.replaceItemName} - ${formData.replaceItemYear} Sucess with ${formData.itemName} status : ${formData.itemStatus}`));
      navigate("/parts");
    } catch (error) {
      console.error(error);
      alert("Error updating item");
    }
  };

  const fetchItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700">Part yang ingin diganti:</label>
        <select name="itemName" value={formData.itemName ? `${formData.itemName} - ${formData.itemYear}` : ""} onChange={handleItemChange} className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Item
          </option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Tahun:</label>
        <input type="number" name="itemYear" value={formData.itemYear} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Status Part Sekarang:</label>
        <select type="text" name="itemStatus" value={formData.itemStatus} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Status
          </option>
          <option value="Spare">Spare</option>
          <option value="Broken">Broken</option>
          <option value="Repair">Repair</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Item Start Use Date:</label>
        <input type="date" name="itemStartUseDate" value={formData.itemStartUseDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Item End Use Date:</label>
        <input type="date" name="itemEndUseDate" value={formData.itemEndUseDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Alasan Penggantian:</label>
        <input type="text" name="reason" value={formData.reason} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Part Pengganti:</label>
        <select name="replaceItemName" value={formData.replaceItemName ? `${formData.replaceItemName} - ${formData.replaceItemYear}` : ""} onChange={handleReplaceItemChange} className="w-full px-3 py-2 border rounded-md">
          <option value="" disabled>
            Select Replace Item
          </option>
          <option value="NA">NA</option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Tahun Part Pengganti:</label>
        <input type="number" name="replaceItemYear" value={formData.replaceItemYear} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Machine Name:</label>
        <input type="text" name="machineName" value={formData.machineName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      {selectedItem && selectedItem.replacementType === "Replace" && (
        <div className="mb-4">
          <label className="block text-gray-700">Use Amount:</label>
          <input type="number" name="useAmount" value={formData.useAmount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        </div>
      )}

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Ganti Part
      </button>
    </form>
  );
};

export default SwapPartForm;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { changeItem, getItems } from "../../utils/items";
// import FormField from "../FormField";
// import { setNotification } from "../../features/notificationSlice";

// const ChangeItemForm = () => {
//   const [items, setItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState("");
//   const [selectedReplaceItem, setSelectedReplaceItem] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     itemName: "",
//     replaceItemName: "",
//     itemStartUseDate: "",
//     itemEndUseDate: "",
//     machineName: "",
//     reason: "",
//     itemYear: "",
//     replaceItemYear: "",
//     itemStatus: "",
//     useAmount: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleItemChange = (e) => {
//     const [name, year] = e.target.value.split(" - ");
//     const item = items.find((item) => item.name === name && item.year.toString() === year);
//     if (item) {
//       setSelectedItem(item);
//       setFormData({
//         ...formData,
//         itemName: item.name,
//         itemYear: item.year,
//       });
//       console.log("Item selected: ", item); // Add this line
//     } else {
//       setSelectedItem(null);
//       setFormData({
//         ...formData,
//         itemName: "",
//         itemYear: "",
//       });
//     }
//   };

//   const handleReplaceItemChange = (e) => {
//     const value = e.target.value;
//     if (value === "NA") {
//       setSelectedReplaceItem(null);
//       setFormData({ ...formData, replaceItemName: "NA", replaceItemYear: "", machineName: "" });
//     } else {
//       const [name, year] = value.split(" - ");
//       const replaceItem = items.find((item) => item.name === name && item.year.toString() === year);
//       if (replaceItem) {
//         setSelectedReplaceItem(replaceItem);
//         setFormData({ ...formData, replaceItemName: replaceItem.name, replaceItemYear: replaceItem.year, machineName: replaceItem.machine.machine_name });
//         console.log("Replace item selected: ", replaceItem); // Add this line
//       } else {
//         setSelectedReplaceItem(null);
//         setFormData({ ...formData, replaceItemName: "", replaceItemYear: "" });
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await changeItem(formData);
//       navigate("/parts");
//       dispatch(setNotification(`${formData.itemName} - ${formData.itemYear} changed to ${formData.replaceItemName} - ${formData.replaceItemYear} with reason ${formData.reason}`));
//     } catch (error) {
//       setError(error.response?.data?.message);
//       // console.error(error);
//     }
//   };

//   const fetchItems = async () => {
//     const data = await getItems();
//     setItems(data);
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   return (
//     <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white shadow-md rounded-lg">
//       <FormField type="select" label="Part yang ingin diganti" name="itemName" value={formData.itemName ? `${formData.itemName} - ${formData.itemYear}` : ""} onChange={handleItemChange} component="select" placeholder="Pilih Part">
//         <option value="" disabled>
//           Select Item
//         </option>
//         {items.map((item) => (
//           <option key={item.uuid} value={`${item.name} - ${item.year}`}>
//             {item.status + " - " + item.name} ({item.year})
//           </option>
//         ))}
//       </FormField>

//       <FormField label="Tahun" name="itemYear" type="number" value={formData.itemYear} onChange={handleChange} placeholder="Masukkan Tahun" />

//       <FormField label="Status Part Sekarang" type="select" name="itemStatus" value={formData.itemStatus} onChange={handleChange} component="select" placeholder="Pilih Status">
//         <option value="" disabled>
//           Select Status
//         </option>
//         <option value="Spare">Spare</option>
//         <option value="Broken">Broken</option>
//         <option value="Repair">Repair</option>
//       </FormField>

//       <FormField label="Part Start Use Date" name="itemStartUseDate" type="date" value={formData.itemStartUseDate} onChange={handleChange} placeholder="Pilih Tanggal Mulai Pakai" />

//       <FormField label="Part End Use Date" name="itemEndUseDate" type="date" value={formData.itemEndUseDate} onChange={handleChange} placeholder="Pilih Tanggal Akhir Pakai" />

//       <FormField label="Alasan Penggantian" name="reason" type="text" value={formData.reason} onChange={handleChange} placeholder="Masukkan Alasan Penggantian" />

//       <FormField
//         label="Part Pengganti"
//         name="replaceItemName"
//         type="select"
//         value={formData.replaceItemName ? `${formData.replaceItemName} - ${formData.replaceItemYear}` : ""}
//         onChange={handleReplaceItemChange}
//         component="select"
//         placeholder="Pilih Part Pengganti"
//       >
//         <option value="" disabled>
//           Select Replace Item
//         </option>
//         <option value="NA">NA</option>
//         {items.map((item) => (
//           <option key={item.uuid} value={`${item.name} - ${item.year}`}>
//             {item.status + " - " + item.name} ({item.year})
//           </option>
//         ))}
//       </FormField>

//       <FormField label="Tahun Part Pengganti" name="replaceItemYear" type="number" value={formData.replaceItemYear} onChange={handleChange} placeholder="Masukkan Tahun Part Pengganti" />

//       <FormField label="Machine Name" name="machineName" type="text" value={formData.machineName} onChange={handleChange} placeholder="Masukkan Nama Mesin" />

//       {selectedItem && selectedItem.replacementType === "Replace" && <FormField label="Use Amount" name="useAmount" type="number" value={formData.useAmount} onChange={handleChange} placeholder="Masukkan Jumlah Penggunaan" />}

//       <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
//         Ganti Part
//       </button>

//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </form>
//   );
// };

// export default ChangeItemForm;

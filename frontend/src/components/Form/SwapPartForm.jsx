import { changeItem, getTypeReplaceitem, getTypeSwapItem, getTypeSwapReplaceItem } from "../../utils/items";
import FormField, { ReadOnlyForm } from "../FormField";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import Button from "../../element/Button";
import LoadingAnimate from "../LoadingAnimate";

const SwapPartForm = () => {
  const [items, setItems] = useState([]);
  const [replaceItems, setReplaceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedMachineName, setSelectedMachineName] = useState("");
  const [selectedReplaceItem, setSelectedReplaceItem] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    fetchItems();
    fetchSwapReplaceItem();
  }, [selectedItem]);

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
      setSelectedMachineName(item.machine.machine_name);
      setFormData({
        ...formData,
        itemName: item.name,
        itemYear: item.year,
      });
      console.log("Item selected: ", item); // Add this line
      console.log("machine selected: ", item.machine.machine_name); // Add this line
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
      setIsLoading(true);
      await changeItem(formData);
      dispatch(setNotification(`${formData.itemName} - ${formData.itemYear} Swap to ${formData.replaceItemName} - ${formData.replaceItemYear} Sucess with ${formData.itemName} status : ${formData.itemStatus}`));
      navigate("/parts");
    } catch (error) {
      setErrors(error);
      // alert("Error updating item");
    }
  };

  const fetchItems = async () => {
    const data = await getTypeSwapItem();
    console.log(data);
    setItems(data);
  };
  const fetchSwapReplaceItem = async () => {
    if (selectedItem) {
      const data = await getTypeSwapReplaceItem(selectedMachineName);
      setReplaceItems(data);
    }
  };

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Swapping Part ...</LoadingAnimate>}
      <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white shadow-md rounded-lg overflow-x-hidden">
        <FormField label="Part yang ingin diganti" name="itemName" value={formData.itemName ? `${formData.itemName} - ${formData.itemYear}` : ""} onChange={handleItemChange} type="select">
          <option value="" disabled>
            Select Item
          </option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </FormField>

        <ReadOnlyForm label="Tahun" name="itemYear" value={formData.itemYear} placeholder={"Tahun Part"} />
        {/* <FormField label="Tahun" name="itemYear" value={formData.itemYear} onChange={handleChange} type="number" placeholder="Masukkan tahun" /> */}

        <FormField label="Status Part Sekarang" name="itemStatus" value={formData.itemStatus} onChange={handleChange} type="select">
          <option value="" disabled>
            Select Status
          </option>
          <option value="Spare">Spare</option>
          <option value="Broken">Broken</option>
          <option value="Repair">Repair</option>
        </FormField>
        <div className="flex gap-5 w-full ">
          <FormField label="Item Start Use Date" name="itemStartUseDate" value={formData.itemStartUseDate} onChange={handleChange} type="date" placeholder="Masukkan tanggal mulai digunakan" className={"w-1/3"} />

          <FormField label="Item End Use Date" name="itemEndUseDate" value={formData.itemEndUseDate} onChange={handleChange} type="date" placeholder="Masukkan tanggal berakhir digunakan" className={"w-1/3"} />
        </div>

        <FormField label="Alasan Penggantian" name="reason" value={formData.reason} onChange={handleChange} placeholder="Masukkan alasan penggantian" />

        <FormField label="Part Pengganti" name="replaceItemName" value={formData.replaceItemName ? `${formData.replaceItemName} - ${formData.replaceItemYear}` : ""} onChange={handleReplaceItemChange} type="select">
          <option value="" disabled>
            Select Replace Item
          </option>
          <option value="NA">NA</option>
          {replaceItems &&
            replaceItems.map((item) => (
              <option key={item.uuid} value={`${item.name} - ${item.year}`}>
                {item.status + " - " + item.name} ({item.year})
              </option>
            ))}
        </FormField>

        <FormField label="Tahun Part Pengganti" name="replaceItemYear" value={formData.replaceItemYear} onChange={handleChange} type="number" placeholder="Masukkan tahun part pengganti" />

        <FormField label="Machine Name" name="machineName" value={formData.machineName} onChange={handleChange} placeholder="Masukkan nama mesin" />

        {selectedItem && selectedItem.replacementType === "Replace" && <FormField label="Use Amount" name="useAmount" value={formData.useAmount} onChange={handleChange} type="number" placeholder="Masukkan jumlah penggunaan" />}

        <Button type="submit" buttonName="Ganti Part" />
        {errors && <p className="text-red-500">{errors.message}</p>}
      </form>
    </div>
  );
};

export default SwapPartForm;

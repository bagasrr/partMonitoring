import { changeItem, getInUseItems, getTypeSwapReplaceItem } from "../../utils/items";
import FormField, { ReadOnlyForm, SelectFormField } from "../FormField";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import Button from "../../element/Button";
import LoadingAnimate from "../LoadingAnimate";
import ErrorText from "../ErrorText";
import { format } from "date-fns";
import { formatDateForm } from "../../utils/format";

const SwapPartForm = () => {
  const [items, setItems] = useState([]);
  const [replaceItems, setReplaceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedMachineName, setSelectedMachineName] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    replaceItemName: "",
    itemStartUseDate: null,
    itemEndUseDate: null,
    reason: "",
    itemYear: "",
    replaceItemYear: "",
    itemStatus: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchSwapReplaceItem();
    }
  }, [selectedItem]);

  const fetchItems = async () => {
    const data = await getInUseItems();
    const sortedData = data.sort((a, b) => {
      if (a.machine?.machine_name < b.machine?.machine_name) {
        return -1;
      }
      if (a.machine?.machine_name > b.machine?.machine_name) {
        return 1;
      }
      return 0;
    });

    setItems(sortedData);
  };

  const fetchSwapReplaceItem = async () => {
    if (selectedItem) {
      console.log("Fetching swap replace items for machine:", selectedMachineName);
      const data = await getTypeSwapReplaceItem(selectedMachineName);
      console.log("Replace items fetched:", data);
      setReplaceItems(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // console.log(name + " : " + value);
  };

  const handleItemChange = (e) => {
    const uuid = e.target.value;
    const item = items.find((item) => item.uuid === uuid);

    setSelectedValue(uuid);

    if (item) {
      setSelectedItem(item);
      setSelectedMachineName(item.machine.machine_name);
      // console.log("Selected item:", item);
      // console.log("Selected machine name:", item.machine.machine_name);
      setFormData({
        ...formData,
        itemName: item.name,
        itemYear: item.year,
        itemStartUseDate: item.replacementDate ? formatDateForm(item.replacementDate) : "",
      });
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
    console.log(value);
    if (value === "NA") {
      setFormData({
        ...formData,
        replaceItemName: "NA",
        replaceItemYear: null,
      });
    } else {
      const [name, year] = value.split(" - ");
      const replaceItem = replaceItems.find((item) => item.name === name && item.year.toString() === year);
      console.log("replaceitem : ", replaceItem);
      if (replaceItem) {
        setFormData({
          ...formData,
          replaceItemName: replaceItem.name,
          replaceItemYear: replaceItem.year,
        });
      } else {
        setFormData({
          ...formData,
          replaceItemName: "",
          replaceItemYear: "",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      replaceItemName: null,
    };
    try {
      setIsLoading(true);
      await changeItem(data);
      dispatch(setNotification(`${formData.itemName} - ${formData.itemYear} Swap Success`));
      navigate("/parts");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors(error);
    }
  };
  // console.log("Item start : ", formData.itemStartUseDate);
  // console.log(formData);

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Swapping Part ...</LoadingAnimate>}
      <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white shadow-md rounded-lg overflow-x-hidden">
        {items.length === 0 ? (
          <p className="text-xl mb-4 text-center">Tidak ada part saat yang digunakan saat ini</p>
        ) : (
          <>
            <FormField label="Part saat ini" name="itemName" value={selectedValue} onChange={handleItemChange} type="select">
              <option value="" disabled>
                Select Item
              </option>

              {items.map((item) => (
                <option key={item.uuid} value={item.uuid}>
                  [{item.item_number}] - {item.name} ({item.machine?.machine_name})
                </option>
              ))}
            </FormField>

            <ReadOnlyForm label="Tahun" name="itemYear" value={formData.itemYear} placeholder={"Tahun Part"} />

            <SelectFormField label="Status Part Sekarang" name="itemStatus" value={formData.itemStatus} onChange={handleChange} type="select">
              <option value="" disabled>
                Select Status
              </option>
              <option value="Spare">Spare</option>
              <option value="Broken">Broken</option>
              <option value="Repair">Repair</option>
            </SelectFormField>
            <div className="flex gap-5 w-full ">
              <FormField label="Part mulai dipakai" name="itemStartUseDate" value={formData.itemStartUseDate} onChange={handleChange} type="date" placeholder="Masukkan tanggal mulai digunakan" className={"w-1/3"} />

              <FormField label="Part berakhir dipakai" name="itemEndUseDate" value={formData.itemEndUseDate} onChange={handleChange} type="date" placeholder="Masukkan tanggal berakhir digunakan" className={"w-1/3"} />
            </div>

            <FormField label="Alasan Penggantian" name="reason" value={formData.reason} onChange={handleChange} placeholder="Masukkan alasan penggantian" />

            <FormField label="Part Pengganti" name="replaceItemName" value={formData.replaceItemName ? `${formData.replaceItemName} - ${formData.replaceItemYear}` : ""} onChange={handleReplaceItemChange} type="select">
              <option value="" disabled>
                Select Replace Item
              </option>
              <option value="NA">NA</option>
              <option value="holaa">holaa</option>
              {replaceItems &&
                replaceItems.map((item) => (
                  <option key={item.uuid} value={`${item.name} - ${item.year}`}>
                    {item.status + " - " + item.name} ({item.year}) {item.machine?.machine_name}
                  </option>
                ))}
            </FormField>

            <Button type="submit" buttonName="Ganti Part" />
          </>
        )}

        {errors && <ErrorText message={errors.message} />}
      </form>
    </div>
  );
};

export default SwapPartForm;

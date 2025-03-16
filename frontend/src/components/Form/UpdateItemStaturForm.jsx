import { useEffect, useState } from "react";
import { getTypeSwapItem, updateItemStatusForm } from "../../utils/items";
import FormField, { ReadOnlyForm, SelectFormField } from "../FormField";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../../features/notificationSlice";
import Button from "../../element/Button";
import LoadingAnimate from "../LoadingAnimate";
import { formatDateForm } from "../../utils/format";

const UpdateItemStatusForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    status: "",
    itemYear: "",
    reason: "",
    item_number: "",
    itemStartUseDate: null,
    itemEndUseDate: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadOption, setLoadOption] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getTypeSwapItem();
      // Gunakan localeCompare untuk membandingkan string
      const sortRes = response.sort((a, b) => {
        if (a.machine?.machine_name < b.machine?.machine_name) {
          return -1;
        }
        if (a.machine?.machine_name > b.machine?.machine_name) {
          return 1;
        }
        return 0;
      });
      setItems(sortRes.length > 0 ? sortRes : []);
      setItems(sortRes);
      setLoadOption(false);
    } catch (error) {
      setLoadOption(false);
      setErrors({ getPart: error.message || "Error fetching Part" });
    }
  };

  const handleItemChange = (e) => {
    const item_uuid = e.target.value;
    const item = items.find((item) => item.uuid === item_uuid);
    console.log("replacementDate : ", item.replacementDate);
    if (item) {
      setSelectedItem(item);
      setFormData({
        ...formData,
        itemName: item.name,
        itemYear: item.year,
        itemStartUseDate: item.replacementDate ? formatDateForm(item.replacementDate) : "",
        item_number: item.item_number,
      });
      console.log(`${item.status} - ${item.name} (${item.year}) - ${item.machine.machine_name}`);
      // Log item selected
      console.log(item);
    } else {
      setSelectedItem(null);
      setFormData({
        ...formData,
        itemName: "",
        itemYear: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // console.log("item start : ", formData.itemStartUseDate);
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (selectedItem && selectedItem.status === newStatus) {
      setErrors({ status: `Cannot change status to '${newStatus}' again` });
    } else {
      setFormData({ ...formData, status: newStatus });
      setErrors({ ...errors, status: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (formData.status === selectedItem.status) {
        setErrors({ submit: `Cannot change status to '${formData.status}' again` });
        return;
      }
      await updateItemStatusForm(formData);
      setIsLoading(true);
      dispatch(setNotification(`Item ${formData.itemName} - ${formData.itemYear} status updated to ${formData.status}`));
      navigate("/parts");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors(error || { submit: "Error updating item status" });
      console.error("Error updating item status:", error);
    }
  };

  return (
    <div>
      {isLoading && formData.status === "Broken" && <LoadingAnimate isOpen={isLoading}>Wait for Update & Send Mail...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField label="Select Parts" name="itemName" value={selectedItem?.uuid} onChange={handleItemChange} type="select" error={errors.getPart}>
          <option value="" disabled>
            {isLoading ? "Loading..." : items.length === 0 ? "No Data Found" : "Select Item"}
          </option>

          {!loadOption &&
            items.length > 0 &&
            items.map((item) => (
              <option key={item.uuid} value={item.uuid}>
                [{item.item_number}] {item.name} ( {item.machine.machine_name} ) | {item.status}
              </option>
            ))}
        </FormField>

        <ReadOnlyForm label="Item Number" name="item_number" value={formData.item_number} />
        <ReadOnlyForm label="Tahun" name="itemYear" value={formData.itemYear} />

        <SelectFormField label="Status Part Sekarang" name="itemStatus" value={formData.status} onChange={handleStatusChange} type="select" error={errors.status}>
          <option value="" disabled>
            Select Status
          </option>
          <option value="In Use">In Use</option>
          <option value="Spare">Spare</option>
          <option value="Broken">Broken</option>
          <option value="Repair">Repair</option>
        </SelectFormField>

        {selectedItem && selectedItem.status === "In Use" && (
          <>
            <div className="flex gap-5 w-full ">
              <FormField label="Part mulai dipakai" name="itemStartUseDate" value={formData.itemStartUseDate} onChange={handleChange} type="date" placeholder="Masukkan tanggal mulai digunakan" className={"w-1/3"} />

              <FormField label="Part berakhir dipakai" name="itemEndUseDate" value={formData.itemEndUseDate} onChange={handleChange} type="date" placeholder="Masukkan tanggal berakhir digunakan" className={"w-1/3"} />
            </div>
          </>
        )}
        <FormField label="Alasan Penggantian" name="reason" value={formData.reason} onChange={handleChange} type="text" />

        <Button type="submit" buttonName={"Save"} />
        {errors.submit && <p className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded relative mb-4">{errors.submit}</p>}
      </form>
    </div>
  );
};

export default UpdateItemStatusForm;

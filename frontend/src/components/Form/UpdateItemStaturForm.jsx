import { useEffect, useState } from "react";
import { getItems, updateItemStatusForm } from "../../utils/items";
import FormField, { ReadOnlyForm } from "../FormField";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../../features/notificationSlice";
import Button from "../../element/Button";
import LoadingAnimate from "../LoadingAnimate";

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
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      setItems(response);
    } catch (error) {
      setErrors({ getPart: error.message || "Error fetching Part" });
    }
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
      console.log("Item selected: ", item); // Log item selected
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
    try {
      if (formData.status === selectedItem.status) {
        setErrors({ submit: `Cannot change status to '${formData.status}' again` });
        return;
      }
      setIsLoading(true);
      await updateItemStatusForm({ itemName: formData.itemName, status: formData.status, itemYear: formData.itemYear, reason: formData.reason });
      dispatch(setNotification(`Item ${formData.itemName} - ${formData.itemYear} status updated to ${formData.status}`));
      navigate("/parts");
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating item status:", error);
      setErrors(error || { submit: "Error updating item status" });
    }
  };

  return (
    <div>
      {isLoading && formData.status === "Broken" && <LoadingAnimate isOpen={isLoading}>Wait for Update & Send Mail...</LoadingAnimate>}
      {isLoading && formData.status !== "Broken" && <LoadingAnimate isOpen={isLoading}>Wait for Update...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField label="Select Parts" name="itemName" value={formData.itemName ? `${formData.itemName} - ${formData.itemYear}` : ""} onChange={handleItemChange} type="select" error={errors.getPart}>
          <option value="" disabled>
            Select Item
          </option>
          {items.map((item) => (
            <option key={item.uuid} value={`${item.name} - ${item.year}`}>
              {item.status + " - " + item.name} ({item.year})
            </option>
          ))}
        </FormField>

        <ReadOnlyForm label="Tahun" name="itemYear" value={formData.itemYear} />

        <FormField label="Status" name="status" value={formData.status} onChange={handleStatusChange} type="select" error={errors.status}>
          <option value="" disabled>
            Select Status
          </option>
          <option value="In Use">In Use</option>
          <option value="Spare">Spare</option>
          <option value="Repair">Repair</option>
          <option value="Broken">Broken</option>
        </FormField>

        <FormField label="Alasan Penggantian" name="reason" value={formData.reason} onChange={handleChange} type="text" />

        <Button type="submit" buttonName={"Save"} />
        {errors.submit && <p className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded relative mb-4">{errors.submit}</p>}
      </form>
    </div>
  );
};

export default UpdateItemStatusForm;

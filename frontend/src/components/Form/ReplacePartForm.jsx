import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingAnimate from "../LoadingAnimate";
import FormField, { ReadOnlyForm } from "../FormField";
import Button from "../../element/Button";
import ErrorText from "../ErrorText";
import { getTypeReplaceitem, replaceItem } from "../../utils/items";
import { setNotification } from "../../features/notificationSlice";

const ReplacePartForm = () => {
  const [parts, setParts] = useState([]);
  const [amount, setAmount] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    itemName: "",
    machine_name: "",
    reason: "",
    useAmount: "",
  });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await getTypeReplaceitem();
      console.log(response);
      setParts(response);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const handlePartChange = (e) => {
    const value = e.target.value;
    const [partName, machine_name] = value.split(" - ");
    console.log("Selected Part:", value);

    const part = parts.find((part) => part.name === partName && part.machine.machine_name === machine_name);

    if (part) {
      setAmount(part.amount);
      setFormData({
        ...formData,
        itemName: part.name,
        machine_name: part.machine.machine_name,
      });
    } else {
      // Jika tidak menemukan part yang sesuai
      console.error("Part tidak ditemukan");
    }
  };
  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await replaceItem(formData);
      dispatch(setNotification(`${formData.itemName} Replace ${formData.useAmount} ea Success`));
      navigate("/parts");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors({ message: error.message });
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Replacing Part...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField type="select" label="Select Part" value={formData.itemName ? `${formData.itemName} - ${formData.machine_name}` : ""} onChange={handlePartChange}>
          <option value="" disabled>
            Select Part
          </option>
          {parts &&
            parts.map((part) => (
              <option value={`${part.name} - ${part.machine.machine_name}`} key={part.uuid}>
                {part.name} - {part.machine.machine_name}
              </option>
            ))}
        </FormField>
        <ReadOnlyForm label="Jumlah saat ini" type="number" name="amount" value={amount || ""} placeholder="Jumlah part saat ini" />
        <FormField label="Jumlah Penggantian" type="number" name="useAmount" onChange={handleChange} value={formData.useAmount} placeholder="Jumlah" />
        <FormField label="Alasan" type="textarea" name="reason" onChange={handleChange} value={formData.reason} placeholder="Alasan" />
        <Button buttonName="Save" type="submit" />
        {errors && <ErrorText message={errors.message} />}
      </form>
    </div>
  );
};

export default ReplacePartForm;

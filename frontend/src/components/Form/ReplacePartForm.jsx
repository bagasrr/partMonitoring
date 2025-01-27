import React, { useEffect, useState } from "react";
import Button from "../../element/Button";
import FormField, { ReadOnlyForm } from "../FormField";
import { getTypeReplaceitem, replaceItem } from "../../utils/items";
import LoadingAnimate from "../LoadingAnimate";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
    itemYear: null,
    machineName: "",
    reason: "",
    useAmount: "",
  });
  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    const response = await getTypeReplaceitem();
    console.log(response);
    setParts(response);
  };

  const handlePartChange = (e) => {
    const { value } = e.target;
    console.log("value : ", value);
    setAmount(parts.find((part) => part.name === value)?.amount);
    setFormData({
      ...formData,
      itemName: value,
      itemYear: parts.find((part) => part.name === value)?.year,
    });
  };
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
      setErrors(error);
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Replacing Part...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField type="select" label="Select Part" value={formData.itemName} onChange={handlePartChange}>
          <option value="" disabled>
            Select Part
          </option>
          {parts &&
            parts.map((part) => (
              <option value={part.name} key={part.uuid}>
                {part.name}
              </option>
            ))}
        </FormField>
        <ReadOnlyForm label="Tahun" name="itemYear" value={formData.itemYear} placeholder="Tahun" />
        <ReadOnlyForm label="Jumlah saat ini" type="number" name={"amount"} value={amount ? amount : ""} placeholder={"Jumlah part saat ini"} />
        <FormField label="Jumlah Penggantian" type="number" name="useAmount" onChange={handleChange} value={formData.useAmount} placeholder="Jumlah" />
        <FormField label="Alasan" type="textarea" name="reason" onChange={handleChange} value={formData.reason} placeholder="Alasan" />

        <Button buttonName={"Save"} type="submit" />
        {errors && <p className="text-red-500 text-center mt-4 font-bold text-xs">{errors.message}</p>}
      </form>
    </div>
  );
};

export default ReplacePartForm;

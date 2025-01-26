import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItemAmount, getTypeReplaceitem } from "../../utils/items";
import FormField, { ReadOnlyForm } from "../FormField";
import { setNotification } from "../../features/notificationSlice";
import Button from "../../element/Button";
import { useNavigate } from "react-router-dom";

const AddAmountForm = () => {
  const [parts, setParts] = useState([]);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [prevAmount, setPrevAmount] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    amountToAdd: null,
    description: "",
  });

  useEffect(() => {
    fetchPart();
  }, []);

  const fetchPart = async () => {
    const response = await getTypeReplaceitem();
    setParts(response);
  };

  const handlePartChange = (e) => {
    const { value } = e.target;
    const selectedPart = parts.find((part) => part.name === value);
    setPrevAmount(selectedPart.amount);
    setFormData({
      ...formData,
      itemName: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert amount and lowerLimit to numbers
    const newValue = name === "amountToAdd" ? Number(value) : value;

    setFormData({ ...formData, [name]: newValue });

    // Validate numerical inputs
    if (name === "amountToAdd") {
      if (newValue < 0) {
        setErrors({ ...errors, [name]: "Nilai harus lebih dari 0" });
      } else {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.itemName,
      amountToAdd: formData.amountToAdd,
      description: formData.description,
    };

    try {
      setIsLoading(true);
      await addItemAmount(data);
      dispatch(setNotification(`${formData.itemName} add amount ${formData.amountToAdd} ea`));
      navigate("/parts");
    } catch (error) {
      setErrors({ submit: error.message || "Error while Add Amount" });
    }
  };

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Adding Part Amount...</LoadingAnimate>}
      <form onSubmit={handleSubmit}>
        <FormField label="Part Name" name="itemName" value={formData.itemName} onChange={handlePartChange} type="select">
          <option value="" disabled>
            Pilih Part
          </option>
          {parts &&
            parts.map((data) => (
              <option key={data.uuid} value={data.name}>
                {data.name}
              </option>
            ))}
        </FormField>

        <ReadOnlyForm label="Prev Amount" name="prevAmount" value={prevAmount} placeholder={"Jumlah Item Sebelumnya"} />

        <FormField label="Amount" name="amountToAdd" type="number" value={formData.amountToAdd} onChange={handleChange} error={errors.amount} placeholder="Masukkan jumlah stok part baru" />
        <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} placeholder="Masukkan deskripsi" />

        <Button type="submit" buttonName="Add Amount" />
        {errors.submit && <p className="text-red-500 text-xs font-bold mt-1 ml-1 text-center">{errors}</p>}
      </form>
    </div>
  );
};

export default AddAmountForm;

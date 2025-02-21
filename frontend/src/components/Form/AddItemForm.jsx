import React, { useEffect, useState } from "react";
import { createItem, getTypeSwapItem } from "../../utils/items";
import FormField from "../FormField";
import { useNavigate } from "react-router-dom";
import { getMachines } from "../../utils/machines";
import { getSections } from "../../utils/section";
import { useDispatch, useSelector } from "react-redux";
import { setDeleted, setNotification } from "../../features/notificationSlice";
import useNotification from "../../hooks/UseNotification";
import Button from "../../element/Button";
import LoadingAnimate from "../LoadingAnimate";
import { getVendors } from "../../utils/vendor";
import Notification from "../Notification";

const AddItemForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isNew, setIsNew] = useState({
    part: false,
    machine: false,
    section: false,
    vendor: false,
    replaceType: false,
  });
  const [list, setList] = useState({
    vendor: [],
    machine: [],
    section: [],
    part: [],
  });
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const { notification, someDeleted } = useNotification();
  const deleted = useSelector((state) => state.notification.deleted);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    item_number: null,
    status: "Not Set",
    lowerLimit: "",
    machine_name: "",
    machine_number: "",
    section_name: "",
    section_number: "",
    replacementType: "",
    year: null,
    vendor_name: null,
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   const isType = name === "replacementType";
  //   if (isType && value === "Swap") {
  //     setIsNew((prev) => ({ ...prev, replaceType: true }));
  //   } else if (isType && value !== "Swap") {
  //     setIsNew((prev) => ({ ...prev, replaceType: false }));
  //   } else {
  //     console.log("WHY");
  //   }

  //   let newValue;
  //   if (name === "amount" || name === "lowerLimit") {
  //     newValue = Number(value);
  //   } else if (name === "year") {
  //     newValue = value === "" ? null : Number(value); // Ubah string kosong jadi null
  //   } else {
  //     newValue = value;
  //   }
  //   setFormData({ ...formData, [name]: newValue });

  //   if (name === "amount" || name === "lowerLimit") {
  //     if (newValue < 0) {
  //       setErrors({ ...errors, [name]: "Nilai Harus lebih dari 0" });
  //     } else {
  //       const newErrors = { ...errors };
  //       delete newErrors[name];
  //       setErrors(newErrors);
  //     }
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newValue;

      if (name === "amount" || name === "lowerLimit") {
        newValue = Number(value);
      } else if (name === "year") {
        newValue = value === "" ? null : Number(value);
      } else {
        newValue = value;
      }

      return { ...prev, [name]: newValue };
    });

    if (name === "replacementType") {
      setIsNew((prev) => ({
        ...prev,
        replaceType: value === "Swap",
      }));
    }

    if (name === "amount" || name === "lowerLimit") {
      setErrors((prevErrors) => {
        if (Number(value) < 0) {
          return { ...prevErrors, [name]: "Nilai Harus lebih dari 0" };
        } else {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.amount <= 0) newErrors.amount = "Nilai harus lebih dari 0";
    if (formData.lowerLimit < 0) newErrors.lowerLimit = "Nilai harus lebih dari 0";
    if (formData.year > new Date().getFullYear()) newErrors.year = "Tahun tidak bisa lebih dari tahun sekarang";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const cleanedFormData = { ...formData };
    if (!cleanedFormData.year) {
      cleanedFormData.year = null;
    }

    try {
      // console.log("formData: ", formData);
      setIsLoading(true);
      await createItem(cleanedFormData);
      dispatch(setNotification(`Part ${formData.name} Added`));
      navigate("/parts");
      setFormData({
        name: "",
        amount: "",
        description: "",
        status: "Not Set",
        lowerLimit: "",
        machine_name: "",
        machine_number: "",
        section_name: "",
        section_number: "",
        year: null,
        item_number: null,
      });
    } catch (error) {
      setError(true);
      dispatch(setNotification(`Error: ${error.message}`));
      dispatch(setDeleted(true));
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNew((prev) => ({ ...prev, part: true }));
      setFormData({ ...formData, name: "", amount: "", description: "" });
    } else {
      setIsNew((prev) => ({ ...prev, part: false }));
      // const selectedPart = list.part.find((part) => part.name === value);
      setFormData({
        ...formData,
        name: value,
        // year: selectedPart?.year || "",
        // lowerLimit: selectedPart?.lowerLimit || "",
        // replacementType: selectedPart?.replacementType || "",
        // machine_name: selectedPart?.machine?.machine_name || "",
        // machine_number: selectedPart?.machine?.machine_number || "",
      });
    }
  };

  const handleMachineChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNew((prev) => ({ ...prev, machine: true }));
      setFormData({ ...formData, machine_name: "", machine_number: "" });
    } else {
      setIsNew((prev) => ({ ...prev, machine: false }));
      const selectedMachine = list.machine.find((machine) => machine.machine_name === value);
      setFormData({
        ...formData,
        machine_name: value,
        machine_number: selectedMachine?.machine_number || "",
        section_name: selectedMachine?.section?.section_name || "",
        section_number: selectedMachine?.section?.section_number || "",
      });
    }
  };

  const handleVendorChange = (e) => {
    const { value } = e.target;
    if (value === "new") {
      setIsNew((prev) => ({ ...prev, vendor: true }));
      setFormData({ ...formData, vendor_name: "" });
    } else {
      setIsNew((prev) => ({ ...prev, vendor: false }));
      setFormData({ ...formData, vendor_name: value });
    }
  };

  const fetchData = async () => {
    try {
      const [machines, sections, parts, vendors] = await Promise.all([getMachines(), getSections(), getTypeSwapItem(), getVendors()]);

      setList((prev) => ({
        ...prev,
        machine: machines,
        section: sections,
        part: parts,
        vendor: vendors,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueParts = Array.from(new Set(list.part.map((item) => item.name))).map((name) => list.part.find((item) => item.name === name)); // untuk menghindari duplikasi nama

  return (
    <div>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Adding Part...</LoadingAnimate>}
      <form onSubmit={handleSubmit} className="shadow-md bg-white p-5 rounded-lg">
        <FormField label="Replacement Type" type="select" name="replacementType" value={formData.replacementType} onChange={handleChange}>
          <option value="" disabled>
            Select Type
          </option>
          <option value="Swap">Swap</option>
          <option value="Replace">Replace</option>
        </FormField>

        {isNew.replaceType && <FormField label="Part Number" name="item_number" value={formData.item_number} onChange={handleChange} placeholder="Masukkan nomor part" />}

        {formData.replacementType === "Replace" ? (
          <FormField label="New Part Name" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama part baru" />
        ) : (
          <FormField label="Part Name" name="name" value={isNew.part ? "new" : formData.name} onChange={handlePartChange} type="select">
            <option value="" disabled>
              Pilih Part
            </option>
            {/* admin can add new part dan user can add to if replaceType = false */}
            {(!isNew.replaceType || user.role === "admin") && <option value="new">Enter New Part</option>}
            {uniqueParts.map((data) => (
              <option key={data.uuid} value={data.name}>
                {data.name}
              </option>
            ))}
          </FormField>
        )}

        {isNew.part && <FormField label="New Part Name" name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama part baru" />}

        <FormField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} placeholder={"Masukkan jumlah part"} />

        {isNew.replaceType && (
          <FormField
            label="Year"
            name="year"
            type="number"
            error={errors.year}
            value={formData.year ?? ""} // Tampilkan string kosong jika null
            onChange={handleChange}
            placeholder={"Masukkan tahun"}
          />
        )}

        <FormField label="Description" name="description" value={formData.description} onChange={handleChange} placeholder={"Masukkan deskripsi"} />

        {isNew.replaceType && (
          <FormField label="Vendor" name="vendor_name" type="select" value={isNew.vendor ? "new" : formData.vendor_name} onChange={handleVendorChange} placeholder={"Masukkan vendor"}>
            <option value="" disabled>
              Pilih Vendor
            </option>
            {list.vendor &&
              list.vendor.map((data) => (
                <option key={data.uuid} value={data.vendor_name}>
                  {data.vendor_name}
                </option>
              ))}
          </FormField>
        )}

        <FormField label="Status" name="status" type="select" value={formData.status} onChange={handleChange}>
          <option value="Not Set" disabled>
            Not Set
          </option>
          <option value="In Use">In Use</option>
          <option value="Spare">Spare</option>
          <option value="Repair">Repair</option>
          <option value="Broken">Broken</option>
        </FormField>

        <FormField label="Lower Limit" name="lowerLimit" type="number" value={formData.lowerLimit} onChange={handleChange} error={errors.lowerLimit} placeholder={"Masukkan batas minimum"} />

        <FormField label="Machine Name" name="machine_name" value={isNew.machine ? "new" : formData.machine_name} onChange={handleMachineChange} type="select">
          <option value="" disabled>
            Pilih Machine
          </option>
          {list.machine &&
            list.machine.map((data) => (
              <option key={data.uuid} value={data.machine_name}>
                {data.machine_name} ({data.machine_number})
              </option>
            ))}
        </FormField>

        {notification && <Notification message={notification} deleted={deleted} />}
        <Button type="submit" buttonName="Add Part" />
      </form>
    </div>
  );
};

export default AddItemForm;

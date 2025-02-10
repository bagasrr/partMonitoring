import React, { useEffect, useState } from "react";
import AddItemForm from "../../components/Form/AddItemForm";
import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import FormField from "../../components/FormField";
import AddAmountForm from "../../components/Form/AddAmountForm";

const AddItemPages = () => {
  const [render, setRender] = useState(null);
  const handleChange = (e) => {
    const { value } = e.target;
    setRender(value);
  };
  return (
    <>
      <BackPrev url="/parts" />
      <Title> {render && render === "AddNew" ? "Tambah Part Baru" : render === "AddAmount" ? "Tambah Jumlah Part" : "Tambah Part"}</Title>
      <FormField type="select" label="Add Type" onChange={handleChange} value={render ? render : ""}>
        <option value="" disabled>
          Select Add Type
        </option>
        <option value="AddNew">Add New</option>
        <option value="AddAmount">Add Amount</option>
      </FormField>
      {render && render === "AddNew" ? <AddItemForm /> : render === "AddAmount" ? <AddAmountForm /> : null}
    </>
  );
};

export default AddItemPages;

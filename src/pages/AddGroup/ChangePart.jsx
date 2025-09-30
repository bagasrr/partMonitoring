import { useState } from "react";
import FormField from "../../components/FormField";
import BackPrev from "../../element/BackPrev";
import Title from "../../element/Title";
import SwapPartForm from "../../components/Form/SwapPartForm";
import UpdateItemStatusForm from "../../components/Form/UpdateItemStaturForm";
import ReplacePartForm from "../../components/Form/ReplacePartForm";
import { Helmet } from "react-helmet-async";

const ChangePartPages = () => {
  const [render, setRender] = useState(null);
  const handleChange = (e) => {
    const { value } = e.target;
    setRender(value);
  };
  return (
    <>
      <Helmet>
        <title>Change Part | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/parts" />
      <Title>Penggantian Part</Title>
      <FormField type="select" label="Tipe Penggantian" onChange={handleChange} value={render ? render : ""}>
        <option value="" disabled>
          Pilih tipe penggantian
        </option>
        <option value="replace">Replace</option>
        <option value="swap">Swap</option>
        <option value="status">Status</option>
      </FormField>
      {render && render === "replace" ? <ReplacePartForm /> : render === "swap" ? <SwapPartForm /> : render === "status" ? <UpdateItemStatusForm /> : null}
    </>
  );
};

export default ChangePartPages;

import { useState } from "react";
import FormField from "../../components/FormField";
import BackPrev from "../../element/BackPrev";
import Title from "../../element/Title";
import Layout from "../Layout";
import SwapPartForm from "../../components/Form/SwapPartForm";
import UpdateItemStatusForm from "../../components/Form/UpdateItemStaturForm";

const ChangePartPages = () => {
  const [render, setRender] = useState(null);
  const handleChange = (e) => {
    const { value } = e.target;
    setRender(value);
  };
  return (
    <Layout>
      <BackPrev url="parts" />
      <Title>Penggantian Part</Title>
      <FormField type="select" label="Change Type" onChange={handleChange} value={render ? render : ""}>
        <option value="" disabled>
          Select Change Type
        </option>
        <option value="replace">Replace</option>
        <option value="swap">Swap</option>
        <option value="status">Status</option>
      </FormField>
      {render && render === "replace" ? <>tesreplace</> : render === "swap" ? <SwapPartForm /> : render === "status" ? <UpdateItemStatusForm /> : null}
    </Layout>
  );
};

export default ChangePartPages;

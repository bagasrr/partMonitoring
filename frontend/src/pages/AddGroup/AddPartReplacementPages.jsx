import { useState } from "react";
import FormField from "../../components/FormField";
import BackPrev from "../../element/BackPrev";
import Title from "../../element/Title";
import Layout from "../Layout";
import SwapPartForm from "../../components/Form/SwapPartForm";

const AddPartReplacementPages = () => {
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
        <option value="Replace">Replace</option>
        <option value="Swap">Swap</option>
      </FormField>
      {render && render === "Replace" ? <>tesReplace</> : render === "Swap" ? <SwapPartForm /> : null}
    </Layout>
  );
};

export default AddPartReplacementPages;

import React, { useEffect, useState } from "react";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";
import ButtonTypeParts from "../components/ButtonTypeParts";
import FormField from "../components/FormField";
import { useDispatch } from "react-redux";
import { getSections } from "../utils/section";

const PartsByMachine = () => {
  const [view, setView] = useState("");
  const dispatch = useDispatch();
  const [list, setList] = useState({
    section: [],
  });
  useEffect(() => {
    getSection();
  }, []);

  const getSection = async () => {
    try {
      const response = await getSections();
      console.log(response);
      setList((prev) => ({
        ...prev,
        section: response,
      }));
    } catch (error) {
      dispatch(setNotification(error.response.data.message));
    }
  };

  const handleChangeSection = (e) => {
    console.log(e.target.value);
  };
  return (
    <Layout>
      <HeaderPages title="Part List" linkAdd="parts" add="part">
        <FormField label="Section" name="section" value={list.section} type="select" onChange={handleChangeSection}>
          <option value="" disabled>
            Select Section
          </option>
          {list.section.map((section, index) => (
            <option key={index} value={section.id}>
              {section.section_name}
            </option>
          ))}
        </FormField>
        <div className="flex gap-5 mb-10">
          <ButtonTypeParts view={view} setView={setView} partType="swap">
            Swap
          </ButtonTypeParts>
          <ButtonTypeParts view={view} setView={setView} partType="replace">
            Replace
          </ButtonTypeParts>
        </div>
      </HeaderPages>
    </Layout>
  );
};

export default PartsByMachine;

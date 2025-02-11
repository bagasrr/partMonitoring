import { useState } from "react";
import ScrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/headerPages";
import ButtonTypeParts from "../components/ButtonTypeParts";
import FormField from "../components/FormField";
import useSections from "../hooks/useSections";
import PartList from "../components/PartList";
import { Helmet } from "react-helmet-async";

const Parts = () => {
  ScrollToTop();
  const [view, setView] = useState("Swap");
  const { sections, selectedSection, handleSectionChange } = useSections();

  return (
    <>
      <Helmet>
        <title>Part List | Part Monitoring</title>
      </Helmet>
      <div className="flex flex-col items-center w-full">
        <HeaderPages title="Part List" linkAdd="parts" add="part">
          <div className="flex gap-5 mb-10">
            {["Swap", "Replace"].map((type) => (
              <ButtonTypeParts key={type} view={view} setView={setView} partType={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </ButtonTypeParts>
            ))}
          </div>
        </HeaderPages>

        <SectionFilter data={sections} selectedData={selectedSection} handleDataChange={handleSectionChange} />

        <div className="w-full">
          <PartList section={selectedSection} type={view} />
        </div>
      </div>
    </>
  );
};

export default Parts;

export const SectionFilter = ({ data, selectedData, handleDataChange }) => {
  return (
    <div className="p-5 flex justify-end">
      <FormField label="Ruangan" name="room" value={selectedData.id ? `${selectedData.id} - ${selectedData.name}` : ""} onChange={handleDataChange} type="select" className="flex items-center gap-2">
        <option value="">Semua</option>
        {data.map((section) => (
          <option key={section.uuid} value={`${section.uuid} - ${section.section_name}`}>
            {section.section_name}
          </option>
        ))}
      </FormField>
    </div>
  );
};

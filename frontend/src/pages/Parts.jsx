import { useState } from "react";
import ScrollToTop from "../utils/scrollToTop";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";
import ButtonTypeParts from "../components/ButtonTypeParts";
import FormField from "../components/FormField";
import ItemsSwap from "../components/ItemsSwap";
import ItemsReplace from "../components/ItemsReplace";
import useSections from "../hooks/useSections";

const Parts = () => {
  ScrollToTop();
  const [view, setView] = useState("swap");
  const { sections, selectedSection, handleSectionChange } = useSections();

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <HeaderPages title="Part List" linkAdd="parts" add="part">
          {/* Tombol Swap & Replace */}
          <div className="flex gap-5 mb-10">
            {["swap", "replace"].map((type) => (
              <ButtonTypeParts key={type} view={view} setView={setView} partType={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </ButtonTypeParts>
            ))}
          </div>
        </HeaderPages>

        {/* Select Filter Ruangan */}
        <SectionFilter data={sections} selectedData={selectedSection} handleDataChange={handleSectionChange} />

        {/* Render Komponen Sesuai View */}
        <div className="w-full">{view === "replace" ? <ItemsReplace section={selectedSection} /> : <ItemsSwap section={selectedSection} />}</div>
      </div>
    </Layout>
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

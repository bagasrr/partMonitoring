import { useState } from "react";
import ScrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/HeaderPages";
import ButtonTypeParts from "../components/ButtonTypeParts";
import useSections from "../hooks/useSections";
import PartList from "../components/PartList";
import { Helmet } from "react-helmet-async";
import { SectionFilter } from "../components/SectionFilter";

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

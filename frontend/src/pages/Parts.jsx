import { useEffect, useState } from "react";
import { getSections } from "../utils/section";
import ScrollToTop from "../utils/scrollToTop";
import Layout from "./layout";
import HeaderPages from "../components/headerPages";
import ButtonTypeParts from "../components/ButtonTypeParts";
import FormField from "../components/FormField";
import ItemsSwap from "../components/ItemsSwap";
import ItemsReplace from "../components/ItemsReplace";

const Parts = () => {
  ScrollToTop();
  const [view, setView] = useState("swap");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState({
    name: "",
    id: "",
  });

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    const response = await getSections();
    setSections(response);
  };

  const handleSectionChange = (e) => {
    if (!e.target.value) {
      setSelectedSection({ name: "", id: "" });
      return;
    }
    const [uuid, name] = e.target.value.split(" - ");
    if (!uuid || !name) return;
    setSelectedSection({ name, id: uuid });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <HeaderPages title="Part List" linkAdd="parts" add="part">
          <div className="flex gap-5 mb-10">
            <ButtonTypeParts view={view} setView={setView} partType="swap">
              Swap
            </ButtonTypeParts>
            <ButtonTypeParts view={view} setView={setView} partType="replace">
              Replace
            </ButtonTypeParts>
          </div>
        </HeaderPages>

        {/* Select Filter Ruangan */}
        <div className="p-5 right-0 flex justify-end">
          <FormField label="Ruangan" name="room" value={selectedSection.id ? `${selectedSection.id} - ${selectedSection.name}` : ""} onChange={handleSectionChange} type="select" className={"flex items-center gap-2"}>
            <option value="">Semua</option>
            {sections.map((section) => (
              <option key={section.uuid} value={`${section.uuid} - ${section.section_name}`}>
                {section.section_name}
              </option>
            ))}
          </FormField>
        </div>

        {/* Kirim selectedSection ke komponen */}
        <div className="w-full">
          {view === "replace" && <ItemsReplace section={selectedSection} />}
          {view === "swap" && <ItemsSwap section={selectedSection} />}
        </div>
      </div>
    </Layout>
  );
};

export default Parts;

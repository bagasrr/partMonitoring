import { useEffect, useState } from "react";
import { getSections } from "../utils/section";

const useSections = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState({ name: "", id: "" });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const response = await getSections();
    setSections(response);
  };

  const handleSectionChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setSelectedSection({ name: "", id: "" });
      return;
    }
    const [uuid, name] = value.split(" - ");
    setSelectedSection({ name, id: uuid });
  };

  return { sections, selectedSection, handleSectionChange };
};

export default useSections;

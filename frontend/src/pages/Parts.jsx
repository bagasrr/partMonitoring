import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import Layout from "./Layout";
import Title from "../element/Title";
import scrollToTop from "../utils/scrollToTop";
import ItemsReplace from "../components/ItemsReplace";
import ItemsSwap from "../components/ItemsSwap";
import HeaderPages from "../components/headerPages";
import ButtonTypeParts from "../components/ButtonTypeParts";

const Parts = () => {
  scrollToTop();
  const [view, setView] = useState("swap");

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

        <div className="w-full">
          {view === "replace" && <ItemsReplace />}
          {view === "swap" && <ItemsSwap />}
        </div>
      </div>
    </Layout>
  );
};

export default Parts;

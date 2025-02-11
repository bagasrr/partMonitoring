import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatusInfo from "../components/StatusInfo";
import Title from "../element/Title";
import DayUsedChart from "../components/DayUsedChart";
import { getBrokenItems, getInUseItems, getRepairItems, getSpareItems, getTypeReplaceitem, getTypeSwapItem } from "../utils/items";
import AmountLimitChart from "../components/AmountLimitChart";
import ButtonTypeParts from "../components/ButtonTypeParts";
import useSections from "../hooks/useSections";
import { SectionFilter } from "./Parts";
import PartList from "../components/PartList";
import { Helmet } from "react-helmet-async";
import { LuMonitorCog } from "react-icons/lu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const [view, setView] = useState("Swap");
  const { sections, selectedSection, handleSectionChange } = useSections();
  const [statusData, setStatusData] = useState({
    spare: [],
    broken: [],
    inUse: [],
    repair: [],
    swapPart: [],
    replacePart: [],
  });
  const memoizedStatusData = useMemo(() => statusData, [statusData]);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchStatusData();
      hasFetchedData.current = true; // Set flag agar tidak dipanggil lagi
    }
  }, []);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  const fetchStatusData = async () => {
    const spare = await getSpareItems();
    const broken = await getBrokenItems();
    const inUse = await getInUseItems();
    const repair = await getRepairItems();
    const swapPart = await getTypeSwapItem();
    const replacePart = await getTypeReplaceitem();

    const sortSwap = swapPart.sort((a, b) => b.dayUsed - a.dayUsed);
    setStatusData({ spare, broken, inUse, repair, swapPart: sortSwap, replacePart });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Part Monitoring</title>
      </Helmet>
      <LuMonitorCog size={65} />

      <h1 className="text-xl font-bold mb-6 ">Welcome - {user && user.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className=" p-4 bg-white shadow rounded-lg">
          <DayUsedChart data={statusData.swapPart} />
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <AmountLimitChart data={statusData.replacePart} />
        </div>
      </div>
      <div className="mt-5">
        <StatusInfo statusData={memoizedStatusData} />
      </div>
      <div className="mt-5">
        <Title>Part List</Title>
        <div className="flex gap-2 mb-5 items-center ">
          {["Swap", "Replace"].map((type) => (
            <ButtonTypeParts key={type} view={view} setView={setView} partType={type}>
              {view === type ? type.charAt(0).toUpperCase() + type.slice(1) : type.charAt(0).toUpperCase()}
            </ButtonTypeParts>
          ))}
          <SectionFilter data={sections} selectedData={selectedSection} handleDataChange={handleSectionChange} />
        </div>

        <div className="w-full">
          <PartList section={selectedSection} type={view} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

export const AnimatedBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen">
      <div onClick={() => setIsExpanded(!isExpanded)} className={`bg-blue-500 h-10 cursor-pointer transition-all duration-500 ease-in-out ${isExpanded ? "w-40" : "w-10"}`}></div>
    </div>
  );
};

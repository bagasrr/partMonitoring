import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import StatusInfo from "../components/StatusInfo";
import Title from "../element/Title";
import DayUsedChart from "../components/DayUsedChart";
import { getTypeReplaceitem, getTypeSwapItem } from "../utils/items";
import AmountLimitChart from "../components/AmountLimitChart";
import ButtonTypeParts from "../components/ButtonTypeParts";
import ItemsReplace from "../components/ItemsReplace";
import ItemsSwap from "../components/ItemsSwap";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const [userName, setUserName] = useState("");
  const [swapPart, setSwapPart] = useState([]);
  const [replacePart, setReplacePart] = useState([]);
  const [view, setView] = useState("swap");

  useEffect(() => {
    getSwap();
    getReplace();
  }, []);

  const getSwap = async () => {
    const response = await getTypeSwapItem();
    const sortedData = response.sort((a, b) => b.dayUsed - a.dayUsed);
    setSwapPart(sortedData);
  };
  const getReplace = async () => {
    const response = await getTypeReplaceitem();
    // const sortedData = response.sort((a, b) => b.amount - a.amount);
    setReplacePart(response);
  };
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-6 ">Welcome - {user && user.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className=" p-4 bg-white shadow rounded-lg">
          <DayUsedChart data={swapPart} />
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <AmountLimitChart data={replacePart} />
        </div>
      </div>
      <div className="mt-5">
        <StatusInfo />
      </div>
      <div className="mt-5">
        <Title>Part List</Title>
        <div className="flex gap-2 mb-5">
          <ButtonTypeParts view={view} setView={setView} partType="swap" className="px-6 py-3 rounded-3xl bg-blue-600 hover:text-white hover:bg-blue-800 transition-all duration-300 ease-in-out">
            {view === "swap" ? "Swap" : "S"}
          </ButtonTypeParts>
          <ButtonTypeParts view={view} setView={setView} partType="replace" className="px-6 py-3 rounded-3xl bg-blue-600 hover:text-white hover:bg-blue-800 transition-all duration-300 ease-in-out">
            {view === "replace" ? "Replace" : "R"}
          </ButtonTypeParts>
        </div>
        <div className="w-full">
          {view === "replace" && <ItemsReplace />}
          {view === "swap" && <ItemsSwap />}
        </div>
      </div>
    </Layout>
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

// import React, { useState } from "react";
// import Layout from "./Layout";
// import StatusInfo from "../components/StatusInfo";
// import Title from "../element/Title";
// import DayUsedChart from "../components/DayUsedChart";
// import AmountLimitChart from "../components/AmountLimitChart";
// import ButtonTypeParts from "../components/ButtonTypeParts";

// const Dashboard = () => {
//   const [view, setView] = useState("swap");

//   return (
//     <Layout>
//       <h1 className="text-xl font-bold mb-6">Welcome</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         <div className="p-4 bg-white shadow rounded-lg">
//           <DayUsedChart data={[]} />
//         </div>
//         <div className="p-4 bg-white shadow rounded-lg">
//           <AmountLimitChart data={[]} />
//         </div>
//       </div>
//       <div className="mt-5">
//         <StatusInfo />
//       </div>
//       <div className="mt-5">
//         <Title>Part List</Title>
//         <div className="flex gap-2">
//           <ButtonTypeParts view={view} setView={setView} partType="swap" className="px-6 py-3 rounded-3xl bg-blue-600 hover:text-white hover:bg-blue-800 transition-all duration-300 ease-in-out">
//             {view === "swap" ? "Swap" : "S"}
//           </ButtonTypeParts>
//           <ButtonTypeParts view={view} setView={setView} partType="replace" className="px-6 py-3 rounded-3xl bg-blue-600 hover:text-white hover:bg-blue-800 transition-all duration-300 ease-in-out">
//             {view === "replace" ? "Replace" : "R"}
//           </ButtonTypeParts>
//         </div>
//         <div className="w-full">
//           {view === "replace" && <ItemsReplace />}
//           {view === "swap" && <ItemsSwap />}
//         </div>

//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;

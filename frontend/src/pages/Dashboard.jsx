import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import StatusInfo from "../components/StatusInfo";
import Title from "../element/Title";
import ItemsTable from "../components/ItemsReplace";
import DayUsedChart from "../components/DayUsedChart";
import { getTypeReplaceitem, getTypeSwapItem } from "../utils/items";
import AmountLimitChart from "../components/AmountLimitChart";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const [userName, setUserName] = useState("");
  const [swapPart, setSwapPart] = useState([]);
  const [replacePart, setReplacePart] = useState([]);

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
      <h1 className="text-xl font-bold">Welcome - {user && user.name}</h1>
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
        <ItemsTable />
      </div>
    </Layout>
  );
};

export default Dashboard;

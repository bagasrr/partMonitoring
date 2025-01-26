import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import ChartComponent from "../components/ChartExample";
import StatusInfo from "../components/StatusInfo";
import Title from "../element/Title";
import ItemsTable from "../components/ItemsTable";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const [userName, setUserName] = useState("");

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
      <div>
        <ChartComponent />
      </div>
      <StatusInfo />
      <div className="mt-5">
        <Title>Part List</Title>
        <ItemsTable />
      </div>
    </Layout>
  );
};

export default Dashboard;

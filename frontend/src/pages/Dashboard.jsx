import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlice";

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
    </Layout>
  );
};

export default Dashboard;
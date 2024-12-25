import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { TData, ThData, TRow } from "../element/Table";

const History = () => {
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/history");
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistories(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-10">History</h1>
      <table>
        <thead>
          <tr>
            <ThData>Tanggal</ThData>
            <ThData>Change Type</ThData>
            <ThData>Item</ThData>
            <ThData>Machine</ThData>
            <ThData>Previous Stock</ThData>
            <ThData>Used Stock</ThData>
            <ThData>After Stock</ThData>
            <ThData>Description</ThData>
            <ThData>User</ThData>
          </tr>
        </thead>
        <tbody>
          {histories.map((history) => (
            <TRow key={history.uuid}>
              <td className="text-sm font-bold text-center">{formatDate(history.createdAt)}</td>
              <TData>{history.changeType}</TData>
              <TData>{history.item.name}</TData>
              <TData>{history.machine.machine_name}</TData>
              <TData>{history.prevStock}</TData>
              <TData>{history.usedStock}</TData>
              <TData>{history.afterStock}</TData>
              <TData>{history.description}</TData>
              <TData>{history.user.name}</TData>
            </TRow>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default History;

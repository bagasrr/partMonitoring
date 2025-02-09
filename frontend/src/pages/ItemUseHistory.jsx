import React from "react";
import Title from "../element/Title";
import ItemUseHistoryTable from "../components/ItemUseHistoryTable";
import Layout from "./layout";

const ItemUseHistory = () => {
  return (
    <Layout>
      <Title>Histori Pemakaian Part</Title>
      <ItemUseHistoryTable />
    </Layout>
  );
};

export default ItemUseHistory;

import React from "react";
import Title from "../element/Title";
import ItemUseHistoryTable from "../components/ItemUseHistoryTable";
import Layout from "./Layout";

const ItemUseHistory = () => {
  return (
    <Layout>
      <Title>List Pemakaian Part</Title>
      <ItemUseHistoryTable />
    </Layout>
  );
};

export default ItemUseHistory;

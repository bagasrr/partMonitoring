import React from "react";
import ItemUsageGraph from "../components/ItemUseGraph";
import Title from "../element/Title";
import Layout from "./Layout";

const ItemUsages = () => {
  return (
    <Layout>
      <Title>Grafik pemakaian item</Title>
      <ItemUsageGraph />
    </Layout>
  );
};

export default ItemUsages;

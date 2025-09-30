import Title from "../element/Title";
import ItemUseHistoryTable from "../components/ItemUseHistoryTable";
import { Helmet } from "react-helmet-async";

const ItemUseHistory = () => {
  return (
    <>
      <Helmet>
        <title>Histori Pemakaian | Part Monitoring</title>
      </Helmet>
      <Title>Histori Pemakaian Part</Title>
      <ItemUseHistoryTable />
    </>
  );
};

export default ItemUseHistory;

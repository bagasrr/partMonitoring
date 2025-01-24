import AddPartReplacementForm from "../../components/Form/AddPartRelpacement";
import ItemUsageGraph from "../../components/ItemUseGraph";
import BackPrev from "../../element/BackPrev";
import Title from "../../element/Title";
import Layout from "../Layout";

const AddPartReplacementPages = () => {
  return (
    <Layout>
      <BackPrev url="parts" />
      <Title>Penggantian Part</Title>
      <AddPartReplacementForm />
    </Layout>
  );
};

export default AddPartReplacementPages;

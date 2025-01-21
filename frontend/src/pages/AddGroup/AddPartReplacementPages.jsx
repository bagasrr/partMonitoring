import AddPartReplacementForm from "../../components/Form/AddPartRelpacement";
import ItemUsageGraph from "../../components/ItemUseGraph";
import Title from "../../element/Title";
import Layout from "../Layout";

const AddPartReplacementPages = () => {
  return (
    <Layout>
      <Title>Penggantian Part</Title>
      <AddPartReplacementForm />
    </Layout>
  );
};

export default AddPartReplacementPages;

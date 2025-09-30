import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";
import scrollToTop from "../../utils/scrollToTop";
import { Helmet } from "react-helmet-async";
import EditSectionForm from "../../components/Form/EditSectionForm";

const EditSection = () => {
  adminArea();
  scrollToTop();
  return (
    <>
      <Helmet>
        <title>Edit Section | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/sections" />
      <Title>Edit Section</Title>
      <EditSectionForm />
    </>
  );
};

export default EditSection;

import Title from "../../element/Title";
import BackPrev from "../../element/BackPrev";
import { adminArea } from "../../utils/adminArea";
import scrollToTop from "../../utils/scrollToTop";
import { Helmet } from "react-helmet-async";
import EditVendorForm from "../../components/Form/EditVendorForm";

const EditVendor = () => {
  adminArea();
  scrollToTop();
  return (
    <>
      <Helmet>
        <title>Edit Vendor | Part Monitoring</title>
      </Helmet>
      <BackPrev url="/vendors" />
      <Title>Edit Vendor</Title>
      <EditVendorForm />
    </>
  );
};

export default EditVendor;

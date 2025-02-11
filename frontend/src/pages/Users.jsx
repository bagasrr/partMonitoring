import UsersTable from "../components/UsersTable";
import { adminArea } from "../utils/adminArea";
import scrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/headerPages";
import { Helmet } from "react-helmet-async";

const Users = () => {
  scrollToTop();
  adminArea();
  return (
    <>
      <Helmet>
        <title>Users | Part Monitoring</title>
      </Helmet>
      <HeaderPages title="Users" linkAdd="users" add="user" />
      <UsersTable />
    </>
  );
};

export default Users;

import Layout from "./layout";
import UsersTable from "../components/UsersTable";
import { adminArea } from "../utils/adminArea";
import scrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/headerPages";

const Users = () => {
  scrollToTop();
  adminArea();
  return (
    <Layout>
      <HeaderPages title="Users" linkAdd="users" add="user" />
      <UsersTable />
    </Layout>
  );
};

export default Users;

import UsersTable from "../components/UsersTable";
import { adminArea } from "../utils/adminArea";
import scrollToTop from "../utils/scrollToTop";
import HeaderPages from "../components/headerPages";

const Users = () => {
  scrollToTop();
  adminArea();
  return (
    <>
      <HeaderPages title="Users" linkAdd="users" add="user" />
      <UsersTable />
    </>
  );
};

export default Users;

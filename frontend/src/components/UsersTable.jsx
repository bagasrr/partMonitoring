// import React, { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { TData, ThData, TRow } from "../element/Table";
// import { useSelector, useDispatch } from "react-redux";
// import { clearNotification, setNotification } from "../features/notificationSlice"; // Import action
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { getUsers } from "../utils/getUser";
// import SearchAndPaginate from "./SearchAndPaginate"; // Import komponen SearchAndPaginate
// import highlightText from "../element/highlightText"; // Import fungsi highlightText

// const UsersTable = () => {
//   const [data, setData] = useState([]);
//   const notification = useSelector((state) => state.notification.message); // Gunakan selector Redux
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     Users();
//     // Hapus notifikasi setelah beberapa detik
//     if (notification) {
//       setTimeout(() => {
//         dispatch(clearNotification());
//       }, 3000);
//     }
//   }, [notification, dispatch]);

//   const Users = async () => {
//     const response = await getUsers();
//     setData(response);
//   };

//   const handleDelete = async (uuid) => {
//     await axios.delete(`http://localhost:4000/api/users/${uuid}`);
//     dispatch(setNotification("User Deleted"));
//   };

//   return (
//     <div className="overflow-x-auto">
//       {notification && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <strong className="font-bold">Success!</strong>
//           <span className="block sm:inline"> {notification}</span>
//         </div>
//       )}
//       <SearchAndPaginate data={data} searchPlaceholder="Search users">
//         {({ currentItems, search }) => (
//           <table className="min-w-full bg-white">
//             <thead>
//               <tr>
//                 <ThData>No</ThData>
//                 <ThData>Nama</ThData>
//                 <ThData>Role</ThData>
//                 <ThData>Action</ThData>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center py-4">
//                     No data found
//                   </td>
//                 </tr>
//               )}
//               {currentItems.map((user, index) => (
//                 <TRow key={user.uuid}>
//                   <TData>{index + 1}</TData>
//                   <TData>{highlightText(user.name, search)}</TData>
//                   <TData>{highlightText(user.role, search)}</TData>
//                   <TData>
//                     <div className="flex gap-5 items-center justify-center">
//                       <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(user.uuid)} />
//                       <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/users/edit/${user.uuid}`)} />
//                     </div>
//                   </TData>
//                 </TRow>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </SearchAndPaginate>
//     </div>
//   );
// };

// export default UsersTable;
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TData, ThData, TRow } from "../element/Table";
import { useSelector, useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../features/notificationSlice"; // Import action
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../utils/getUser";
import SearchBar from "./SearchBar"; // Import komponen SearchBar
import Pagination from "./Pagination"; // Import komponen Pagination
import highlightText from "../element/highlightText"; // Import fungsi highlightText

const UsersTable = () => {
  const [data, setData] = useState([]);
  const notification = useSelector((state) => state.notification.message); // Gunakan selector Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    Users();
    // Hapus notifikasi setelah beberapa detik
    if (notification) {
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  }, [notification, dispatch]);

  const Users = async () => {
    const response = await getUsers();
    setData(response);
  };

  const handleDelete = async (uuid) => {
    await axios.delete(`http://localhost:4000/api/users/${uuid}`);
    dispatch(setNotification("User Deleted"));
  };

  const filteredData = data.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase()));

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageClick = (selectedItem) => {
    const { selected } = selectedItem;
    setCurrentPage(selected);
  };

  return (
    <div className="overflow-x-auto">
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {notification}</span>
        </div>
      )}
      <SearchBar search={search} setSearch={setSearch} placeholder="Search users" />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <ThData>No</ThData>
            <ThData>Nama</ThData>
            <ThData>Role</ThData>
            <ThData>Action</ThData>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No data found
              </td>
            </tr>
          )}
          {currentItems.map((user, index) => (
            <TRow key={user.uuid}>
              <TData>{indexOfFirstItem + index + 1}</TData>
              <TData>{highlightText(user.name, search)}</TData>
              <TData>{highlightText(user.role, search)}</TData>
              <TData>
                <div className="flex gap-5 items-center justify-center">
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(user.uuid)} />
                  <FaEdit className="text-blue-500 cursor-pointer" onClick={() => navigate(`/users/edit/${user.uuid}`)} />
                </div>
              </TData>
            </TRow>
          ))}
        </tbody>
      </table>
      {pageCount > 0 && <Pagination pageCount={pageCount} handlePageClick={handlePageClick} forcePage={currentPage} />}
    </div>
  );
};

export default UsersTable;

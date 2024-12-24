import React from "react";
import { FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa"; // Import ikon yang dibutuhkan
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout, reset } from "../features/authSlice";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate("/");
  };
  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-gray-800 text-white shadow-md">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">GENERAL</h2>
        <ul className="mb-8">
          <li className="mb-2 flex items-center">
            <FaTachometerAlt className="mr-2" />
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-2 flex items-center">
            <FaBox className="mr-2" />
            <Link to="/items" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Items
            </Link>
          </li>
        </ul>
        {user.role === "admin" && (
          <>
            <h2 className="text-lg font-semibold mb-4">ADMIN</h2>
            <ul className="mb-8">
              <li className="mb-2 flex items-center">
                <FaUsers className="mr-2" />
                <Link to="/users" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Users
                </Link>
              </li>
            </ul>
          </>
        )}
        <h2 className="text-lg font-semibold mb-4">SETTINGS</h2>
        <ul>
          <li className="mb-2 flex items-center">
            <FaSignOutAlt className="mr-2" />

            <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-700 rounded">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

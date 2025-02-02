import React from "react";
import { FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { BsBuildingFillGear } from "react-icons/bs";
import { MdOutlineManageHistory } from "react-icons/md";
import { PiEngineFill, PiNotePencilBold } from "react-icons/pi";
import { IoMdListBox } from "react-icons/io";
import { MdCreateNewFolder, MdMeetingRoom } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout, reset } from "../features/authSlice";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed overflow-y-auto pt-5 pb-20 left-0 top-16 h-full w-72 md:w-64 z-30 bg-gray-800 text-white shadow-md transition-transform transform ${
          isOpen ? "translate-x-0 " : "-translate-x-full"
        } duration-500 lg:translate-x-0  lg:w-64`}
      >
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
              <FaHistory className="mr-2" />
              <Link to="/history" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Riwayat
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <MdOutlineManageHistory className="mr-2" />
              <Link to="/itemusehistory" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Pemakaian
              </Link>
            </li>
          </ul>
          {user && user.role === "admin" && (
            <>
              <h2 className="text-lg font-semibold mb-4">ADMIN</h2>
              <ul className="mb-8">
                <li className="mb-2 flex items-center">
                  <FaUsers className="mr-2" />
                  <Link to="/users" className="block px-4 py-2 hover:bg-gray-700 rounded">
                    Users
                  </Link>
                </li>
                <li className="mb-2 flex items-center">
                  <PiEngineFill className="mr-2" />
                  <Link to="/machines" className="block px-4 py-2 hover:bg-gray-700 rounded">
                    Machines
                  </Link>
                </li>
                <li className="mb-2 flex items-center">
                  <MdMeetingRoom className="mr-2" />
                  <Link to="/sections" className="block px-4 py-2 hover:bg-gray-700 rounded">
                    Sections
                  </Link>
                </li>
                <li className="mb-2 flex items-center">
                  <BsBuildingFillGear className="mr-2" />
                  <Link to="/vendors" className="block px-4 py-2 hover:bg-gray-700 rounded">
                    Vendors
                  </Link>
                </li>
              </ul>
            </>
          )}
          <h2 className="text-lg font-semibold mb-4">PARTS</h2>
          <ul className="mb-8">
            <li className="mb-2 flex items-center">
              <IoMdListBox className="mr-2" />
              <Link to="/parts" className="block px-4 py-2 hover:bg-gray-700 rounded">
                List Part
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <MdCreateNewFolder className="mr-2" />
              <Link to="/parts/add" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Part Masuk
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <PiNotePencilBold className="mr-2" />
              <Link to="/parts/changepart" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Ganti Part
              </Link>
            </li>
          </ul>
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

      {/* Overlay for Mobile Sidebar */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;

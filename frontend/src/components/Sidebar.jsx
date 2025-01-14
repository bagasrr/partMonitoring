import React from "react";
import { FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { PiEngineFill, PiEngineLight, PiNotePencilBold } from "react-icons/pi";
import { IoMdListBox } from "react-icons/io";
import { MdCreateNewFolder, MdMeetingRoom } from "react-icons/md";
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
    <div className="fixed overflow-y-auto pb-20 left-0 top-16 h-full w-64 bg-gray-800 text-white shadow-md">
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
              Histori
            </Link>
          </li>
          {user && user.role === "admin" && (
            <>
              <li className="mb-2 flex items-center">
                <FaBox className="mr-2" />
                <Link to="/items" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  List Part
                </Link>
              </li>
            </>
          )}
        </ul>
        {user && user.role === "admin" && (
          <>
            <h2 className="text-lg font-semibold mb-4">ADMIN</h2>
            <ul className="mb-8">
              <li className="mb-2 flex items-center">
                <FaUsers className="mr-2" />
                <Link to="/users" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  List User
                </Link>
              </li>
              <li className="mb-2 flex items-center">
                <PiEngineFill className="mr-2" />
                <Link to="/machines" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  List Mesin
                </Link>
              </li>
              <li className="mb-2 flex items-center">
                <MdMeetingRoom className="mr-2" />

                <Link to="/sections" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  List Ruangan
                </Link>
              </li>
            </ul>
          </>
        )}
        {/* {user && user.role !== "admin" && (
          <> */}
        <h2 className="text-lg font-semibold mb-4">PARTS</h2>
        <ul className="mb-8">
          <li className="mb-2 flex items-center">
            <IoMdListBox className="mr-2" />
            <Link to="/items" className="block px-4 py-2 hover:bg-gray-700 rounded">
              List Part
            </Link>
          </li>
          <li className="mb-2 flex items-center">
            <MdCreateNewFolder className="mr-2" />
            <Link to="/items/add" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Part Masuk
            </Link>
          </li>
          <li className="mb-2 flex items-center">
            <PiNotePencilBold className="mr-2" />
            <Link to="/items/changepart" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Ganti Part
            </Link>
          </li>
        </ul>
        {/* </>
        )} */}

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

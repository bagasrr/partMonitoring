import React, { useEffect } from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout, reset, getMe } from "../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  const handleLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">PartMonitoring</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="text-gray-800 hover:text-white bg-gray-100 hover:bg-red-500 font-bold py-2 px-4 rounded flex items-center">
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            <div className="flex items-center gap-3">
              <FaUser className="ml-2" />
              <h1>{user && user.name}</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useRef } from "react";
import { FaSignOutAlt, FaUser, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout, reset, getMe } from "../features/AuthSlice";
import { toggleSidebar } from "../features/sidebarSlice";
import { MdClose } from "react-icons/md";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!user && !hasFetchedUser.current) {
      dispatch(getMe());
      hasFetchedUser.current = true;
    }
  }, [dispatch, user]);

  // useEffect(() => {
  //   if (!user) {
  //     dispatch(getMe());
  //   }
  // }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate("/login");
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav className="fixed top-0 w-full bg-green-800 shadow-md z-40 py-2 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to={"/dashboard"} className="text-2xl font-bold">
              Part Monitoring
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex">
              <button onClick={handleLogout} className="text-gray-800 hover:text-white bg-gray-100 hover:bg-red-500 font-bold py-2 px-4 rounded flex items-center">
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
              <Link to="/profile" className="flex items-center gap-3 hover:text-indigo-200">
                <FaUser className="ml-2" />
                <h1>{user && user.name}</h1>
              </Link>
            </div>

            <button onClick={handleToggleSidebar} className="lg:hidden text-white focus:outline-none">
              {isOpen ? <MdClose size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import AddUser from "./pages/AddUser";
import History from "./pages/History";
import Machines from "./pages/Machines";
import Sections from "./pages/Sections";
import EditMachine from "./pages/EditGroup/EditMachine";
import YoureNotAdmin from "./pages/YoureNotAdmin";
import AddSection from "./pages/AddGroup/AddSection";
import AddItemPages from "./pages/AddGroup/AddItemPages";
import EditItem from "./pages/EditGroup/EditItem";
import AddMachineNew from "./pages/AddGroup/AddMachineNew";
import Parts from "./pages/Parts";
import ChangePartPages from "./pages/AddGroup/ChangePart";
import ItemUseHistory from "./pages/ItemUseHistory";
import Details from "./pages/Details";
import Vendors from "./pages/Vendors";
import PartsByMachine from "./pages/PartsByMachine";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/parts",
    element: <Parts />,
  },
  {
    path: "/parts/:uuid/details",
    element: <Details />,
  },
  {
    path: "/parts/add",
    element: <AddItemPages />,
  },
  {
    path: "/parts/:id/edit",
    element: <EditItem />,
  },
  {
    path: "/parts/by-machine",
    element: <PartsByMachine />,
  },
  {
    path: "/parts/changepart",
    element: <ChangePartPages />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/edit/:id",
    element: <EditUser />,
  },
  {
    path: "/users/add/",
    element: <AddUser />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/machines/add",
    element: <AddMachineNew />,
  },
  {
    path: "/machines",
    element: <Machines />,
  },
  {
    path: "/machines/:id/edit",
    element: <EditMachine />,
  },
  {
    path: "/sections",
    element: <Sections />,
  },
  {
    path: "/sections/add",
    element: <AddSection />,
  },
  {
    path: "/vendors",
    element: <Vendors />,
  },
  {
    path: "/yourenotadmin",
    element: <YoureNotAdmin />,
  },
  {
    path: "/itemusehistory",
    element: <ItemUseHistory />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/Items";
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
import AddPartReplacementPages from "./pages/AddGroup/AddPartReplacementPages";
import ItemUsages from "./pages/ItemUsages";

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
    path: "/items",
    element: <Items />,
  },
  {
    path: "/items/add/new",
    element: <AddItemPages />,
  },
  {
    path: "/items/edit/:id",
    element: <EditItem />,
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
    path: "/items/changepart",
    element: <AddPartReplacementPages />,
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
    path: "/machines/edit/:id",
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
    path: "/yourenotadmin",
    element: <YoureNotAdmin />,
  },
  {
    path: "/itemusage",
    element: <ItemUsages />,
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

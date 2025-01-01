import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/Items";
import EditItem from "./pages/EditItem";
import NewAddItem from "./pages/NewAddItem";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import AddUser from "./pages/AddUser";
import ChangePartForm from "./pages/ChangePartForm";
import History from "./pages/History";
import Machines from "./pages/Machines";
import Sections from "./pages/Sections";
import EditMachine from "./pages/EditGroup/EditMachine";
import AddMachine from "./pages/AddGroup/AddMachine";
import YoureNotAdmin from "./pages/YoureNotAdmin";
import AddSection from "./pages/AddGroup/AddSection";

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
    path: "/items/add",
    element: <NewAddItem />,
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
    element: <ChangePartForm />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/machines/add",
    element: <AddMachine />,
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
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

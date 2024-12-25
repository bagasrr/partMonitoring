import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/Items";
import EditItem from "./pages/EditItem";
import NewAddItem from "./pages/NewAddItem";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import AddUser from "./pages/AddUser";
import ChangePartForm from "./pages/ChangePartForm";
import History from "./pages/History";

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
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

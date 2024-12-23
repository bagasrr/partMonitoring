import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Items from "./pages/Items";
import AddItems from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import NewAddItem from "./pages/NewAddItem";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";

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
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

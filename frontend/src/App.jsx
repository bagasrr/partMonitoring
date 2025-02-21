import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
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
import AddUser from "./pages/AddGroup/AddUser";
import AddVendor from "./pages/AddGroup/AddVendor";
import TestingPage from "./pages/testing";
import Register from "./pages/Register";
import Layout from "./pages/layout";
import ErrorElement from "./components/ErrorElement";
import Profile from "./pages/Profile";
import EditSection from "./pages/EditGroup/EditSection";
import EditVendor from "./pages/EditGroup/EditVendor";
import Error500 from "./components/Page500Error";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  { path: "/error500", element: <Error500 /> },
  { path: "/access-denied", element: <YoureNotAdmin /> },
  {
    path: "/",
    element: <Layout />, // 👈 Layout sebagai wrapper
    errorElement: <ErrorElement />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/parts", element: <Parts /> },
      { path: "/parts/:uuid/details", element: <Details /> },
      { path: "/parts/add", element: <AddItemPages /> },
      { path: "/parts/:id/edit", element: <EditItem /> },
      { path: "/parts/changepart", element: <ChangePartPages /> },
      { path: "/users", element: <Users /> },
      { path: "/users/edit/:id", element: <EditUser /> },
      { path: "/users/add/", element: <AddUser /> },
      { path: "/history", element: <History /> },
      { path: "/machines/add", element: <AddMachineNew /> },
      { path: "/machines", element: <Machines /> },
      { path: "/machines/:id/edit", element: <EditMachine /> },
      { path: "/sections", element: <Sections /> },
      { path: "/sections/add", element: <AddSection /> },
      { path: "/sections/:id/edit", element: <EditSection /> },
      { path: "/vendors", element: <Vendors /> },
      { path: "/vendors/add", element: <AddVendor /> },
      { path: "/vendors/:id/edit", element: <EditVendor /> },
      { path: "/testing", element: <TestingPage /> },
      { path: "/itemusehistory", element: <ItemUseHistory /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

const App = () => {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};

export default App;

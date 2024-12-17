import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element: Element }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  return user && user.role === "admin" ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

export default function UserRoutes() {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
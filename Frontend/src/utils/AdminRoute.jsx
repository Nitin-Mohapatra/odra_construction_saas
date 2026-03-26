import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not logged in
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  // If logged in but not admin
  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
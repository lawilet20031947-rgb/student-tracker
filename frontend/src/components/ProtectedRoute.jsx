import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  // Simple protection: require a logged-in user (auth.currentUser)
  if (!auth || !auth.currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

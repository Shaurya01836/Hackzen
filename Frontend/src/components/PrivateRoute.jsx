import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protects routes based on required role and profile completion.
 * @param {ReactNode} children - Component to render
 * @param {string[]} allowedRoles - Roles that can access this route
 */
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If profile is not completed, redirect to /register (unless already there)
  if (!user.profileCompleted && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;

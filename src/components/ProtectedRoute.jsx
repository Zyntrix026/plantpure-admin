import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth'; // Path check kar lein

const ProtectedRoute = () => {
  const isAuth = isAuthenticated();

  // Agar user login nahi hai, toh login page par redirect karein
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Agar login hai, toh child routes (AdminLayout) dikhayein
  return <Outlet />;
};

export default ProtectedRoute;
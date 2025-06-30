import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = React.memo(({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Don't show loading screen, just redirect immediately if not authenticated
  if (loading) {
    return null; // Return nothing while checking
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute; 
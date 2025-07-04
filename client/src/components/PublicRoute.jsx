import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = React.memo(({ children, redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Don't show loading screen, just redirect immediately if authenticated
  if (loading) {
    return null; 
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated) {
    // Check if there's a "from" location to redirect back to
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return children;
});

PublicRoute.displayName = 'PublicRoute';

export default PublicRoute; 
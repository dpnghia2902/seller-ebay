// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireSeller, requireVerified }) => {
  const { user, loading, isSeller, isVerified } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireSeller && !isSeller) {
    return <Navigate to="/" replace />;
  }

  if (requireVerified && !isVerified) {
    return <Navigate to="/seller/store/subscription" replace />;
  }

  return children;
};

export default ProtectedRoute;
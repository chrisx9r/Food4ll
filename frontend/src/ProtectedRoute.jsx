import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    // Not logged in, redirect
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child component
  return children;
}

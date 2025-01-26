// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Placeholder login logic
    // In reality, this would make an API call
    if (email && password) {
      setUser({
        email,
        role: email.includes('donor') ? 'Donor' : 'Recipient',
        organization: 'Test Organization'
      });
      return true;
    }
    return false;
  };

  const signup = async (userData) => {
    // Placeholder signup logic
    const { email, password, role, organizationName } = userData;
    if (email && password) {
      setUser({
        email,
        role,
        organization: organizationName
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
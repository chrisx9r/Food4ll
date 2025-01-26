// src/Dashboard.jsx
import React from 'react';
import { useAuth } from './contexts/AuthContext';

function Dashboard({ setCurrentPage }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome to Food4All</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Organization:</strong> {user?.organization}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            {user?.role === 'Donor' ? (
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Create New Donation
              </button>
            ) : (
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Browse Available Donations
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
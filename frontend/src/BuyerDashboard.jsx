import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function BuyerDashboard() {
  const { fetchWithAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    organization_name: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch existing buyer requests
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const response = await fetchWithAuth('/api/buyer_dashboard', {
        method: 'GET'
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data.buyer_requests || []);
      } else {
        setError(data.message || 'Error loading requests');
      }
    } catch (err) {
      setError('Network error');
    }
  }

  async function handleCreateRequest(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetchWithAuth('/api/buyer_dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
      const data = await response.json();
      if (response.ok) {
        // Request created, reload requests
        setNewRequest({ organization_name: '', description: '' });
        loadRequests();
      } else {
        setError(data.message || 'Unable to create request');
      }
    } catch (err) {
      setError('Network error');
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
      <h1>Buyer Dashboard</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="dashboard-box">
        <h2>Create a Buyer Request</h2>
        <form onSubmit={handleCreateRequest}>
          <div className="form-group">
            <label>Organization Name</label>
            <input 
              type="text"
              value={newRequest.organization_name}
              onChange={(e) => setNewRequest({ 
                ...newRequest, 
                organization_name: e.target.value 
              })}
              placeholder="Organization Name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest({
                ...newRequest,
                description: e.target.value
              })}
              placeholder="What do you need?"
            />
          </div>

          <button type="submit">Submit Request</button>
        </form>
      </div>

      <div className="dashboard-box">
        <h2>Your Submitted Requests</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Organization Name</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.organization_name}</td>
                <td>{req.description}</td>
                <td>{req.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleLogout} className="logout-button">Log Out</button>
    </div>
  );
}

export default BuyerDashboard;

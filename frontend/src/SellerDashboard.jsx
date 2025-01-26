import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function SellerDashboard() {
  const { fetchWithAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    description: '',
    category: '',
    quantity: '',
    quality: ''
  });
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
    loadBuyerRequests();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetchWithAuth('/api/seller_dashboard');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.food_posts || []);
      } else {
        setError(data.message || 'Error loading posts');
      }
    } catch (error) {
      setError('Network error');
    }
  }

  async function loadBuyerRequests() {
    // If you want to show all buyer requests to the seller:
    try {
      const res = await fetchWithAuth('/api/buyer_dashboard'); 
      const data = await res.json();
      if (res.ok) {
        setBuyerRequests(data.buyer_requests || []);
      } else {
        setError(data.message || 'Error loading buyer requests');
      }
    } catch (error) {
      setError('Network error');
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetchWithAuth('/api/seller_dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const data = await response.json();
      if (response.ok) {
        // Refresh posts
        setNewPost({ description: '', category: '', quantity: '', quality: '' });
        loadPosts();
      } else {
        setError(data.message || 'Unable to create post');
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
      <h1>Seller Dashboard</h1>
      {error && <p className="error-text">{error}</p>}

      <div className="dashboard-box">
        <h2>Create a Food Post</h2>
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              placeholder="Describe the food"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input 
              type="text"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              placeholder="Fruit, Vegetable, etc."
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input 
              type="number"
              value={newPost.quantity}
              onChange={(e) => setNewPost({ ...newPost, quantity: e.target.value })}
              placeholder="Quantity"
            />
          </div>
          <div className="form-group">
            <label>Quality</label>
            <input 
              type="text"
              value={newPost.quality}
              onChange={(e) => setNewPost({ ...newPost, quality: e.target.value })}
              placeholder="Fresh, Good, etc."
            />
          </div>
          <button type="submit">Post Food</button>
        </form>
      </div>

      <div className="dashboard-box">
        <h2>Your Active Posts</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Quality</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.description}</td>
                <td>{post.category}</td>
                <td>{post.quantity}</td>
                <td>{post.quality}</td>
                <td>{post.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-box">
        <h2>All Buyer Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {buyerRequests.map((r, i) => (
              <tr key={i}>
                <td>{r.organization_name}</td>
                <td>{r.description}</td>
                <td>{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleLogout} className="logout-button">Log Out</button>
    </div>
  );
}

export default SellerDashboard;

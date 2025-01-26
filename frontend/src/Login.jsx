// src/Login.jsx
import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";

function Login({ setCurrentPage }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        setCurrentPage("dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Failed to log in");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        <p className="login-link">
          Don't have an account?{" "}
          <button 
            onClick={() => setCurrentPage("signup")}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#4f46e5',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
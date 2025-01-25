// LoginForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
    postalCode: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="organizationName">Organization Name</label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              placeholder="Enter Organization Name"
              value={formData.organizationName}
              onChange={handleChange}
            />
            {errors.organizationName && (
              <div className="error">{errors.organizationName}</div>
            )}
          </div>

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
            {errors.email && <div className="error">{errors.email}</div>}
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
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
            />
            {errors.country && <div className="error">{errors.country}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              placeholder="Enter postal code"
              value={formData.postalCode}
              onChange={handleChange}
            />
            {errors.postalCode && <div className="error">{errors.postalCode}</div>}
          </div>

          <div className="form-group">
          <label htmlFor="role">Role</label>
  <select
    id="role"
    name="role"
    value={formData.role}
    onChange={handleChange}
  >
    <option value="">Select a Role</option>
    <option value="Donor">Donor</option>
    <option value="Recipient">Recipient</option>
  </select>
  {errors.role && <div className="error">{errors.role}</div>}
</div>

          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account?{" "}
          <Link to="/Login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

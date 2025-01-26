import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    phoneNumber: "",
    country: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setSuccessMsg('');

    // Basic client-side validation
    if (!formData.email || !formData.password || !formData.userType) {
      setErrors('Email, Password, and User Type are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          user_type: formData.userType,
          organization_name: formData.organizationName,
          phone_number: formData.phoneNumber,
          country: formData.country,
          postal_code: formData.postalCode
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Signup successful! You can now log in.');
        // Optionally, redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrors(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      setErrors('An error occurred during signup.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create an Account</h1>
        
        {errors && <div className="error-text">{errors}</div>}
        {successMsg && <div className="success-text">{successMsg}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organization Name</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Enter organization name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="form-group">
            <label>User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select User Type</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>

          <button type="submit" className="submit-button">Sign Up</button>
        </form>
        
        <p className="login-link">
          Already have an account?{" "}
          <button onClick={() => navigate('/login')} className="link-button">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, fetchWithAuth } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        // data.access_token = JWT
        login(data.access_token);
        if (data.user.user_type === 'buyer') {
          navigate('/buyer-dashboard');
        } else {
          navigate('/seller-dashboard');
        }
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Login error');
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="submit-button">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <button className="link-button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // optional styles

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Food4ll</h1>
      <p>Your app to help end food scarcity!</p>
      <Link to="/signup">Sign Up</Link> | <Link to="/login">Log In</Link>
    </div>
  );
}

export default Home;
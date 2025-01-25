import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

// Optional: Create a layout component if you want consistent layout across pages
const RootLayout = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};

// Optional: Create a NotFound component for 404 errors
const NotFound = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <RootLayout>
      <Routes>
        {/* Redirect root to signup page */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
}

export default App;




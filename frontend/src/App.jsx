// src/App.jsx
import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./Dashboard"; // You'll need to create this

function App() {
  const [currentPage, setCurrentPage] = useState("signup");

  const renderPage = () => {
    switch (currentPage) {
      case "signup":
        return <Signup setCurrentPage={setCurrentPage} />;
      case "login":
        return <Login setCurrentPage={setCurrentPage} />;
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      default:
        return (
          <div>
            <h1>404 - Page Not Found</h1>
            <button onClick={() => setCurrentPage("signup")}>
              Go to Signup
            </button>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <div>{renderPage()}</div>
    </AuthProvider>
  );
}

export default App;

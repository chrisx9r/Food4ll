import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [currentPage, setCurrentPage] = useState("signup"); // Default route

  // A simple function to render the appropriate page based on state
  const renderPage = () => {
    switch (currentPage) {
      case "signup":
        return <Signup />;
      case "login":
        return <Login />;
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
    <div>
      <nav>
        <button onClick={() => setCurrentPage("signup")}>Signup</button>
        <button onClick={() => setCurrentPage("login")}>Login</button>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;





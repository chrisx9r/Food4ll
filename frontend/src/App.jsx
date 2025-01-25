import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [currentPage, setCurrentPage] = useState("signup");

  const renderPage = () => {
    switch (currentPage) {
      case "signup":
        return <Signup setCurrentPage={setCurrentPage} />;
      case "login":
        return <Login setCurrentPage={setCurrentPage} />;
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

  return <div>{renderPage()}</div>;
}

export default App;




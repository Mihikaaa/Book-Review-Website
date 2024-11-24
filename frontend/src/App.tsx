import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddReview from "./pages/AddReview";
import MyBooks from "./pages/MyBooks";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("username"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("username"));
      setUsername(localStorage.getItem("username") || "");
    };

    // Listen for localStorage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <HomePage username={username} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-review"
          element={isAuthenticated ? <AddReview /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-books"
          element={isAuthenticated ? <MyBooks /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

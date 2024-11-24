import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css"; // Reuse the same styles

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate fields
    if (!formData.username || !formData.password) {
      setError("Both fields are required.");
      return;
    }
  
    try {
      console.log("Submitting login request:", formData);
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });
  
      console.log("API Response:", response.data);
  
      if (response.status === 200 && response.data.username) {
        const { username } = response.data;
  
        // Save the username to localStorage
        localStorage.setItem("username", username);
  
        console.log("Login successful! Redirecting to home...");
        navigate("/home"); // Redirect to home page
      } else {
        setError("Unexpected response format.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid username or password.");
    }
  };
  
  
  

  return (
    <div className="register-page">
      <div className="register-left">
        <img src="/logo-image.png" alt="ReadRank Logo" className="logo" />
        
        <h3><p>Rank Your Reads, Discover The Best</p></h3>
      </div>
      <div className="register-right">
        <div className="register-form-container">
          <h2>Welcome Back!</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </label>
            <button type="submit">Login</button>
            <p className="redirect-login">
              Don't Have An Account?{" "}
              <span onClick={() => navigate("/register")}>Register</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

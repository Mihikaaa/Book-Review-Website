import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      setError("User Already Exists");
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
          <h2>Register To ReadRank</h2>
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
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </label>
            <button type="submit">Register</button>
            <p className="redirect-login">
              Already Have An Account? <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

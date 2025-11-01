import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = ({ goToRegister, goToHome }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(`${base.replace(/\/$/, "")}/api/login`, {
        username,
        password,
      });
      alert(response.data.message);
      goToHome();
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Optional CRM logo */}
      {/* <img src="/logo.png" alt="CRM Logo" className="crm-logo" /> */}

      <div className="login-card">
        <h2>CRM Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="switch-text">
          Don’t have an account?{" "}
          <span onClick={goToRegister}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

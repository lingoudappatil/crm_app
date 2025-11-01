import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";

const RegisterPage = ({ goToLogin, goToHome }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(`${base.replace(/\/$/, "")}/api/register`, {
        username,
        email,
        address,
        state,
        password,
      });
      alert(response.data.message);
      goToHome();
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">CRM Registration</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="auth-input"
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>
        <p className="auth-switch-text">
          Already have an account?{" "}
          <span onClick={goToLogin}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

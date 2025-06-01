import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";
import baseUrl from "../config";

const Auth = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const validateForm = () => {
    if (isRegister) {
      if (!formData.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? `${baseUrl}/api/v1/auth/register`: `${baseUrl}/api/v1/auth/login`;
      const { data } = await axios.post(endpoint, formData);

      if (isRegister) {
        // After successful registration, switch to login view
        setIsRegister(false);
        setFormData(prev => ({
          ...prev,
          username: "",
          confirmPassword: "",
        }));
        setError("");
        // Show success message
        alert("Registration successful! Please login with your credentials.");
      } else {
        // Handle successful login
        if (data.token) {
          login(data.token, data.user);
          navigate("/");
        } else {
          throw new Error("No authentication token received");
        }
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src="/PowerLogo.png" alt="" />
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <h2>{isRegister ? "Register" : "Login"}</h2>
          {isRegister && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
          {isRegister && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : (isRegister ? "Sign Up" : "Login")}
          </button>
        </form>
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              if (!loading) {
                setIsRegister(!isRegister);
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: ""
                });
                setError("");
              }
            }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;

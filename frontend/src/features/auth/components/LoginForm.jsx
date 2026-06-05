import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../../services/api";
import { Mail, Lock } from "lucide-react";

export default function LoginForm({ onLoginSuccess }) {
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the Google JWT to our backend to verify and get our own JWT
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential
      });
      
      const jwtToken = response.data.token || response.data; // Adjust depending on backend response
      localStorage.setItem("jwt_token", jwtToken);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <>
      <h1>Welcome back</h1>
      <p className="subtitle">Please enter your details to sign in.</p>
      {error && <p className="error-text">{error}</p>}
      
      <div className="google-btn-wrapper">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError("Google login was unsuccessful")}
          width="100%"
        />
      </div>

      <div className="auth-divider">or continue with email</div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail />
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock />
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
        </div>

        <a href="#" className="forgot-pwd">Forgot password?</a>

        <button type="submit" className="btn-primary">Sign In</button>
      </form>

      <div className="auth-footer">
        Don't have an account? <a href="#">Sign Up</a>
      </div>
    </>
  );
}

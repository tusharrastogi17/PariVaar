import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "./api";

export default function Login({ onLoginSuccess }) {
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
    <div className="login-container">
      <h2>Welcome to PariVaar</h2>
      <p>Please log in to continue.</p>
      {error && <p className="error-text">{error}</p>}
      <div className="google-btn-wrapper">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError("Google login was unsuccessful")}
        />
      </div>
    </div>
  );
}

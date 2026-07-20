import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import api, { isValidJwtToken } from "../../api/api";
import { Mail, Lock, User as UserIcon, Phone } from "lucide-react";

export default function LoginForm({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setSuccess("");
      // Send the Google JWT to our backend to verify and get our own JWT
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential
      });
      
      const jwtToken = response.data?.token?.trim();
      if (!isValidJwtToken(jwtToken)) {
        throw new Error("Server did not return a valid session token");
      }
      localStorage.setItem("jwt_token", jwtToken);
      localStorage.setItem("user_email", response.data?.email || "");
      localStorage.setItem("user_first_name", response.data?.firstName || "");
      localStorage.setItem("user_last_name", response.data?.lastName || "");
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Google login failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (isSignUp && (!firstName || !lastName)) {
      setError("First and last names are required.");
      return;
    }

    try {
      if (isSignUp) {
        // Send request to /auth/signup
        const response = await api.post("/auth/signup", {
          email,
          password,
          firstName,
          lastName,
          phoneNumber: phoneNumber || null
        });

        const jwtToken = response.data?.token?.trim();
        if (!isValidJwtToken(jwtToken)) {
          throw new Error("Server did not return a valid session token");
        }
        localStorage.setItem("jwt_token", jwtToken);
        localStorage.setItem("user_email", response.data?.email || "");
        localStorage.setItem("user_first_name", response.data?.firstName || "");
        localStorage.setItem("user_last_name", response.data?.lastName || "");
        setSuccess("Registration successful! Logging in...");
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1000);
      } else {
        // Send request to /auth/signin
        const response = await api.post("/auth/signin", {
          email,
          password
        });

        const jwtToken = response.data?.token?.trim();
        if (!isValidJwtToken(jwtToken)) {
          throw new Error("Server did not return a valid session token");
        }
        localStorage.setItem("jwt_token", jwtToken);
        localStorage.setItem("user_email", response.data?.email || "");
        localStorage.setItem("user_first_name", response.data?.firstName || "");
        localStorage.setItem("user_last_name", response.data?.lastName || "");
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      const serverMessage = err.response?.data;
      setError(typeof serverMessage === "string" ? serverMessage : "Authentication failed. Please verify credentials.");
    }
  };

  return (
    <>
      <h1>{isSignUp ? "Create an Account" : "Welcome back"}</h1>
      <p className="subtitle">
        {isSignUp
          ? "Fill in your details to register."
          : "Please enter your details to sign in."}
      </p>
      {error && <p className="error-text" style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
      {success && <p className="success-text" style={{ color: "#22c55e", marginBottom: "1rem", fontSize: "0.875rem" }}>{success}</p>}
      
      <div className="google-btn-wrapper">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login was unsuccessful")}
          width="100%"
        />
      </div>

      <div className="auth-divider">or continue with email</div>

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <UserIcon size={18} />
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <UserIcon size={18} />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number (Optional)</label>
              <div className="input-wrapper">
                <Phone size={18} />
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {!isSignUp && <a href="#" className="forgot-pwd">Forgot password?</a>}

        <button type="submit" className="btn-primary" style={{ marginTop: "1rem", cursor: "pointer" }}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="auth-footer">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsSignUp(!isSignUp);
            setError("");
            setSuccess("");
          }}
          style={{ cursor: "pointer", fontWeight: "600" }}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </a>
      </div>
    </>
  );
}

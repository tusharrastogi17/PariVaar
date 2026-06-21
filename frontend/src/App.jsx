import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import { isValidJwtToken } from "./api/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isValidJwtToken(localStorage.getItem("jwt_token")));
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (isValidJwtToken(token)) {
      setIsAuthenticated(true);
    } else if (token) {
      localStorage.removeItem("jwt_token");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setIsAuthenticated(false);
    setShowLogin(false);
  };

  if (isAuthenticated) {
    return (
      <DashboardLayout onLogout={handleLogout}>
        <Dashboard />
      </DashboardLayout>
    );
  }

  if (showLogin) {
    return (
      <LoginPage 
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setShowLogin(false);
        }} 
        onBack={() => setShowLogin(false)} 
      />
    );
  }

  return <LandingPage onLoginClick={() => setShowLogin(true)} />;
}

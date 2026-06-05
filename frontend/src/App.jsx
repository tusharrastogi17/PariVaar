import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import FamilyTreePage from "./pages/FamilyTreePage";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <DashboardLayout onLogout={handleLogout}>
          <FamilyTreePage />
        </DashboardLayout>
      ) : (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

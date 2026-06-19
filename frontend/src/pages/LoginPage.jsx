import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { Network } from "lucide-react";

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="login-page-bg">
      <div className="login-logo">
        <Network size={32} />
        <span>FamilyLinks</span>
      </div>
      <div className="login-card">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

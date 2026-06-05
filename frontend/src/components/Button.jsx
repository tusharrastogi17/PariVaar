import React from "react";

export default function Button({ children, onClick, disabled, className = "", style = {}, type = "button" }) {
  return (
    <button
      type={type}
      className={`primary-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

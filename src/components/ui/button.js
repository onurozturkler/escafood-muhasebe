import React from "react";

export function Button({ children, className = "", onClick, type = "button" }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-blue-600 text-white rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;

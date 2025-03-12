import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`p-4 shadow-md rounded bg-white ${className}`}>
      {children}
    </div>
  );
}

export default Card;

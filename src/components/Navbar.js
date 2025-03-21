import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"; // ✅ CSS'in Yüklendiğinden Emin Ol

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* ✅ LOGO */}
        <Link to="/" className="logo">
          <img 
            src="https://esca-food.com/image/catalog/esca-food-logo.png" 
            alt="EscaFood Logo" 
            width="190"
            height="150"
          />
        </Link>

        {/* ✅ Masaüstü Menü */}
        <div className="button-container">
          {navLinks.map((item, index) => (
            <button 
              key={index} 
              onClick={() => navigate(item.to)}
              className="custom-button"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

const navLinks = [
  { to: "/", text: "Ana Sayfa" },
  { to: "/teklifler", text: "Teklifler" },
  { to: "/tahsilatlar", text: "Tahsilatlar" },
  { to: "/musteriler", text: "Müşteriler" },
  { to: "/urunler", text: "Ürünler" }
];

export default Navbar;

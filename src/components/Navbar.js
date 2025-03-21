import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"; // ✅ CSS dosyanı dahil ettiğinden emin ol

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768 && window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "mobile-small" : ""}`}>
      <div className="navbar-container">
        {/* ✅ LOGO */}
        <Link to="/" className="logo">
          <img 
            src="https://esca-food.com/image/catalog/esca-food-logo.png" 
            alt="EscaFood Logo"
            className={`logo-img ${isScrolled ? "mobile-small" : ""}`}
          />
        </Link>

        {/* ✅ Butonlar */}
        <div className={`button-container ${isScrolled ? "mobile-small" : ""}`}>
          {navLinks.map((item, index) => (
            <button 
              key={index} 
              onClick={() => navigate(item.to)}
              className={`custom-button ${isScrolled ? "mobile-small" : ""}`}
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

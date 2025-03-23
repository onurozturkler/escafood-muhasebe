import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const navLinks = [
  { to: "/", text: "Ana Sayfa" },
  { to: "/teklifler", text: "Teklifler" },
  { to: "/tahsilatlar", text: "Tahsilatlar" },
  { to: "/musteriler", text: "Müşteriler" },
  { to: "/urunler", text: "Ürünler" },
];

function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    const isNowMobile = window.innerWidth <= 768;
    setIsMobile(isNowMobile);
  };

  const updateBodyClass = () => {
    const body = document.body;
    body.classList.remove("desktop", "mobile", "menu-open", "scrolled");

    if (window.innerWidth <= 768) {
      body.classList.add("mobile");
      if (menuOpen) body.classList.add("menu-open");
    } else {
      body.classList.add("desktop");
    }

    if (window.scrollY > 30) {
      body.classList.add("scrolled");
    }
  };

  handleResize();
  updateBodyClass();

  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", updateBodyClass);
  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", updateBodyClass);
  };
}, [menuOpen]);

  return (
    <nav className={`navbar ${isScrolled ? "mobile-small" : ""}`}>
      <div className={`navbar-container ${isScrolled ? "mobile-small" : ""}`}>
        {/* ✅ Logo */}
        <Link to="/" className="logo">
          <img
            src="https://esca-food.com/image/catalog/esca-food-logo.png"
            alt="EscaFood Logo"
            className={`logo-img ${isScrolled ? "mobile-small" : ""} ${menuOpen ? "menu-open" : ""}`}
          />
        </Link>

        {/* ✅ Hamburger Buton */}
        {isMobile && (
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        )}

        {/* ✅ Butonlar */}
        {(menuOpen || !isMobile) && (
          <div className={`button-container ${isScrolled ? "mobile-small" : ""}`}>
            {navLinks.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(item.to);
                }}
                className={`custom-button ${isScrolled ? "mobile-small" : ""}`}
              >
                {item.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

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

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      const logo = document.querySelector(".logo-img");
      const body = document.body;

      if (window.innerWidth <= 768) {
        if (window.scrollY > 30) {
          setIsScrolled(true);
          navbar?.classList.add("mobile-small");
          logo?.classList.add("mobile-small");
          body.style.paddingTop = "110px";
        } else {
          setIsScrolled(false);
          navbar?.classList.remove("mobile-small");
          logo?.classList.remove("mobile-small");
          body.style.paddingTop = "140px";
        }
      } else {
        if (window.scrollY > 30) {
          setIsScrolled(true);
          navbar?.classList.add("mobile-small");
          logo?.classList.add("mobile-small");
          body.style.paddingTop = "100px";
        } else {
          setIsScrolled(false);
          navbar?.classList.remove("mobile-small");
          logo?.classList.remove("mobile-small");
          body.style.paddingTop = "150px";
        }
      }
    };


    handleScroll(); // ilk render'da çalıştır
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
className={`logo-img ${isScrolled ? "mobile-small" : ""} ${menuOpen ? "menu-open" : ""}`}
      <div className={`navbar-container ${isScrolled ? "mobile-small" : ""}`}>
        {/* ✅ Logo */}
        <Link to="/" className="logo">
          <img
            src="https://esca-food.com/image/catalog/esca-food-logo.png"
            alt="EscaFood Logo"
            className={`logo-img ${isScrolled ? "mobile-small" : ""}`}
          />
        </Link>

        {/* ✅ Hamburger Menüsü */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: window.innerWidth <= 768 ? "block" : "none" }}
        >
          ☰
        </button>

        {/* ✅ Butonlar */}
        {(menuOpen || window.innerWidth > 768) && (
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

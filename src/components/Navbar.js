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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      const logo = document.querySelector(".logo-img");
      const body = document.body;

      if (isMobile) {
        if (window.scrollY > 30) {
          setIsScrolled(true);
          navbar?.classList.add("mobile-small");
          logo?.classList.add("mobile-small");
          body.style.paddingTop = menuOpen ? "490px" : "180px";
        } else {
          setIsScrolled(false);
          navbar?.classList.remove("mobile-small");
          logo?.classList.remove("mobile-small");
          body.style.paddingTop = menuOpen ? "490px" : "180px";
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

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll(); // başlangıçta çalışsın
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, menuOpen]);

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

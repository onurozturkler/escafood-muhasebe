import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    const updatePadding = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        document.body.style.paddingTop = navbar.offsetHeight + "px";
      }
    };

    updatePadding(); // Sayfa yüklendiğinde çalıştır
    window.addEventListener("resize", updatePadding); // Ekran boyutu değiştiğinde güncelle

    return () => {
      window.removeEventListener("resize", updatePadding);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img
            src="https://esca-food.com/image/catalog/esca-food-logo.png"
            alt="EscaFood Logo"
            width="190"
            height="150"
          />
        </Link>

        <div className="button-container">
          {navLinks.map((item, index) => (
            <button key={index} onClick={() => navigate(item.to)} className="custom-button">
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

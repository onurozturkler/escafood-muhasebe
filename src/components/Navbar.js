import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo - Buton Değil, Link Kullanıldı */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="https://esca-food.com/image/catalog/esca-food-logo.png" 
            alt="EscaFood Logo" 
            style={{ height: "120px", width: "auto" }} 
          />
        </Link>

        {/* Masaüstü Menü */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((item, index) => (
            <button 
              key={index} 
              onClick={() => navigate(item.to)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Mobil Menü Butonu */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobil Menü */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-blue-900 shadow-lg transition-transform duration-300 p-4">
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map((item, index) => (
              <button 
                key={index} 
                onClick={() => {
                  navigate(item.to);
                  setMenuOpen(false);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold w-full text-center hover:bg-yellow-400 hover:text-black transition duration-300"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}
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

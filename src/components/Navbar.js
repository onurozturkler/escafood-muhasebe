import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        
        {/* ✅ LOGO */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="https://esca-food.com/image/catalog/esca-food-logo.png" 
            alt="EscaFood Logo" 
            className="h-16 w-auto"
          />
        </Link>

        {/* ✅ Masaüstü Menü */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((item, index) => (
            <button 
              key={index} 
              onClick={() => navigate(item.to)}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg shadow-md text-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* ✅ Mobil Menü Açma/Kapama Butonu */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* ✅ Mobil Menü (Animasyonlu Aç/Kapa) */}
      <div className={`md:hidden fixed top-0 left-0 w-full h-screen bg-blue-900 bg-opacity-95 z-40 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <div className="flex flex-col items-center space-y-6 mt-24">
          {navLinks.map((item, index) => (
            <button 
              key={index} 
              onClick={() => {
                navigate(item.to);
                setMenuOpen(false);
              }}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-md text-lg font-semibold w-3/4 text-center hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* ❌ Kapatma Butonu */}
        <button 
          className="absolute top-6 right-6 text-white text-3xl"
          onClick={() => setMenuOpen(false)}
        >
          ✖
        </button>
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

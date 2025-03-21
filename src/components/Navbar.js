import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


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
 width="80"
    height="50"
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

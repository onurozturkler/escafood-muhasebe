import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">ESCAFOOD_MUHASEBE_2.0</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Ana Sayfa</Link>
        <Link to="/teklifler" className="hover:underline">Teklifler</Link>
        <Link to="/tahsilatlar" className="hover:underline">Tahsilatlar</Link>
        <Link to="/musteriler" className="hover:underline">Müşteriler</Link>
        <Link to="/urunler" className="hover:underline">Ürünler</Link>
      </div>
    </nav>
  );
}

export default Navbar;

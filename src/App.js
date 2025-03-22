import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Teklifler from "./pages/Teklifler";
import TeklifDetay from "./pages/TeklifDetay";
import YeniTeklif from "./pages/YeniTeklif";
import Tahsilatlar from "./pages/Tahsilatlar";
import TahsilatDetay from "./pages/TahsilatDetay";
import Musteriler from "./pages/Musteriler";
import MusteriDetay from "./pages/MusteriDetay";
import Urunler from "./pages/Urunler";
import TeklifEkle from "./pages/TeklifEkle";

function handleNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    const logo = document.querySelector(".logo-img");
    const body = document.body;

    if (window.scrollY > 30) {
        navbar.classList.add("mobile-small");
        logo?.classList.add("mobile-small");
        body.style.paddingTop = "80px";
    } else {
        navbar.classList.remove("mobile-small");
        logo?.classList.remove("mobile-small");
        body.style.paddingTop = "150px";
    }
}

window.addEventListener("load", handleNavbarScroll);
window.addEventListener("scroll", handleNavbarScroll);
window.addEventListener("resize", handleNavbarScroll);

function App() {
  return (
    <Router>
      {/* ✅ Navbar'ı sabit tuttuk */}
      <Navbar />

      {/* ✅ Navbar'ın içeriği kapatmaması için padding eklendi */}
      <div className="pt-24 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teklifler" element={<Teklifler />} />
          <Route path="/teklifler/detay/:id" element={<TeklifDetay />} />
          <Route path="/yeni-teklif" element={<YeniTeklif />} />
          <Route path="/tahsilatlar" element={<Tahsilatlar />} />
          <Route path="/tahsilatlar/detay/:id" element={<TahsilatDetay />} />
          <Route path="/musteriler" element={<Musteriler />} />
          <Route path="/musteriler/detay/:id" element={<MusteriDetay />} />
          <Route path="/urunler" element={<Urunler />} />
          <Route path="/teklifler/yeni" element={<TeklifEkle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

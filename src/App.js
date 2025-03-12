import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // ✅ Doğru
import { useParams, useNavigate } from "react-router-dom";  // ✅ Doğru
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Teklifler from "./pages/Teklifler";
import TeklifDetay from "./pages/TeklifDetay";
import YeniTeklif from "./pages/YeniTeklif";
import Tahsilatlar from "./pages/Tahsilatlar";
import TahsilatDetay from "./pages/TahsilatDetay"; // 📌 **Tahsilat Detay Sayfasını Ekledik**
import Musteriler from "./pages/Musteriler";
import MusteriDetay from "./pages/MusteriDetay";
import Urunler from "./pages/Urunler";
import TeklifEkle from "./pages/TeklifEkle";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teklifler" element={<Teklifler />} />
          <Route path="/teklifler/detay/:id" element={<TeklifDetay />} />
          <Route path="/yeni-teklif" element={<YeniTeklif />} />
          <Route path="/tahsilatlar" element={<Tahsilatlar />} />
          <Route path="/tahsilatlar/detay/:id" element={<TahsilatDetay />} /> {/* 📌 **Eksik Route eklendi** */}
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

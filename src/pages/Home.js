import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";  // ✅ CSS dosyasını eklemeyi unutma!

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Ana Sayfa</h1>
            <div className="button-grid">
                <button className="home-button" onClick={() => navigate("/teklifler")}>
                    <span className="material-icons">description</span> {/* Teklifler İkonu */}
                    TEKLİFLER
                </button>
                <button className="home-button" onClick={() => navigate("teklifler/yeni")}>
                    <span className="material-icons">note_add</span> {/* Yeni Teklif İkonu */}
                    YENİ TEKLİF
                </button>
                <button className="home-button" onClick={() => navigate("/tahsilatlar")}>
                    <span className="material-icons">attach_money</span> {/* Tahsilatlar İkonu */}
                    TAHSİLATLAR
                </button>
                <button className="home-button" onClick={() => navigate("/musteriler")}>
                    <span className="material-icons">people</span> {/* Müşteriler İkonu */}
                    MÜŞTERİLER
                </button>
                <button className="home-button" onClick={() => navigate("/urunler")}>
                    <span className="material-icons">inventory</span> {/* Ürünler İkonu */}
                    ÜRÜNLER
                </button>
            </div>
        </div>
    );
};

export default Home;

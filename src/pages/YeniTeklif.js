import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const YeniTeklif = () => {
    return (
        <div>
            <h1>Yeni Teklif</h1>
            <Link to="/teklifekle">
                <button>Yeni Teklif Ekle</button>
            </Link>
        </div>
    );
};

export default YeniTeklif;

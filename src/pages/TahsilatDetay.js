import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { generateTahsilatPDF } from "../lib/pdfGenerator";
import "../styles/TahsilatDetay.css";

const TahsilatDetay = () => {
  const { id } = useParams();
  const [tahsilat, setTahsilat] = useState(null);
  const [musteri, setMusteri] = useState(null);

  useEffect(() => {
    const fetchTahsilatVeMusteri = async () => {
      if (!id) return;

      // 📌 Tahsilat Verisini Çek
      const tahsilatRef = doc(db, "tahsilatlar", id);
      const tahsilatSnap = await getDoc(tahsilatRef);
      
      if (tahsilatSnap.exists()) {
        const tahsilatData = tahsilatSnap.data();
        setTahsilat(tahsilatData);

        // 📌 Müşteri Verisini Çek
        if (tahsilatData.musteriId) {
          const musteriRef = doc(db, "musteriler", tahsilatData.musteriId);
          const musteriSnap = await getDoc(musteriRef);
          
          if (musteriSnap.exists()) {
            setMusteri(musteriSnap.data());
          }
        }
      }
    };

    fetchTahsilatVeMusteri();
  }, [id]);

  if (!tahsilat || !musteri) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="tahsilat-container">
     

      <h2 className="title" style={{ color: tahsilat.iptal ? "red" : "black" }}>
    {tahsilat.iptal ? "İPTAL Tahsilat Detayı" : "Tahsilat Detayı"}
</h2>


      <div className="detail-box">
        <p><span>Tahsilat No:</span> {tahsilat.tahsilatNo}</p>
        <p><span>Tarih:</span> {new Date(tahsilat.tarih).toLocaleDateString("tr-TR")}</p>
        <p><span>Müşteri:</span> {musteri.musteriAdi || "Bilinmiyor"}</p>
        <p><span>Adres:</span> {musteri.adres || "Bilinmiyor"}</p>
        <p><span>Tahsilat Tutarı:</span> {parseFloat(tahsilat.tahsilatTutari).toLocaleString()} TL</p>
        <p><span>Tahsilat Türü:</span> {tahsilat.tahsilatTuru}</p>
        <p><span>Açıklama:</span> {tahsilat.aciklama}</p>
      </div>

      <div className="button-container">
        <button onClick={() => generateTahsilatPDF(tahsilat, musteri)} className="download-btn">
          PDF İndir
        </button>
      </div>
    </div>
  );
};

export default TahsilatDetay;

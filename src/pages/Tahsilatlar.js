import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import TahsilatEkle from "./TahsilatEkle";

const Tahsilatlar = () => {
    const [tahsilatlar, setTahsilatlar] = useState([]);
    const [showTahsilatEkle, setShowTahsilatEkle] = useState(false);
    const [sortColumn, setSortColumn] = useState("tarih");
    const [sortDirection, setSortDirection] = useState("desc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTahsilatlar();
    }, []);

    const fetchTahsilatlar = async () => {
        const querySnapshot = await getDocs(collection(db, "tahsilatlar"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTahsilatlar(data);
    };

    // 📌 Sıralama Fonksiyonu
    const sortedTahsilatlar = [...tahsilatlar]
        .sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            if (sortColumn === "tarih") { 
                valA = new Date(valA);
                valB = new Date(valB);
            }

            return sortDirection === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

    // 📌 Sütuna Tıklayınca Sıralamayı Değiştir
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("desc");
        }
    };

    // 📌 Tahsilat İptal Fonksiyonu
    const handleTahsilatIptal = async (tahsilatId, musteriId, tahsilatTutari) => {
        const onay = window.confirm("Bu tahsilatı iptal etmek istediğinize emin misiniz?");
        if (!onay) return;

        try {
            const tahsilatRef = doc(db, "tahsilatlar", tahsilatId);
            await updateDoc(tahsilatRef, { iptal: true });

            const musteriRef = doc(db, "musteriler", musteriId);
            const musteriDoc = await getDoc(musteriRef);

            if (musteriDoc.exists()) {
                const musteriData = musteriDoc.data();
                const yeniCariHesap = (musteriData.carihesap || 0) - tahsilatTutari;
                await updateDoc(musteriRef, { carihesap: yeniCariHesap });
            }

            await fetchTahsilatlar();
            alert("Tahsilat başarıyla iptal edildi!");
        } catch (error) {
            console.error("Tahsilat iptali sırasında hata oluştu:", error);
            alert("Tahsilat iptal edilirken bir hata oluştu!");
        }
    };

    return (
        <div>
            <h2>Tahsilatlar</h2>
            <button onClick={() => setShowTahsilatEkle(!showTahsilatEkle)}>+ Yeni Tahsilat Ekle</button>
            {showTahsilatEkle && <div style={{ marginBottom: "20px" }}><TahsilatEkle /></div>}

            <table className="styled-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("tarih")}>Tarih {sortColumn === "tarih" ? (sortDirection === "asc" ? "▲" : "▼") : ""}</th>
                        <th onClick={() => handleSort("tahsilatNo")}>Belge No {sortColumn === "tahsilatNo" ? (sortDirection === "asc" ? "▲" : "▼") : ""}</th>
                        <th onClick={() => handleSort("musteriAdi")}>Müşteri Adı {sortColumn === "musteriAdi" ? (sortDirection === "asc" ? "▲" : "▼") : ""}</th>
                        <th onClick={() => handleSort("tahsilatTutari")}>Tahsilat Tutarı {sortColumn === "tahsilatTutari" ? (sortDirection === "asc" ? "▲" : "▼") : ""}</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
<tbody>
    {sortedTahsilatlar.map((tahsilat) => (
        <tr key={tahsilat.id} style={{
            textDecoration: tahsilat.iptal ? "line-through" : "none",  // ✅ Üstü çizili yap
            color: tahsilat.iptal ? "grey" : "black" // ✅ Kırmızı renk
        }}>
            <td>{new Date(tahsilat.tarih).toLocaleDateString("tr-TR")}</td>
            <td>{tahsilat.tahsilatNo}</td>
            <td>{tahsilat.musteriAdi || "Bilinmeyen"}</td>
            <td>₺{tahsilat.tahsilatTutari.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
            <td>
<button className="detay-buton" onClick={() => navigate(`/tahsilatlar/detay/${tahsilat.id}`)}>
                    Detay
                </button>
                {!tahsilat.iptal && (
                    <button className="iptal-buton" onClick={() => handleTahsilatIptal(tahsilat.id, tahsilat.musteriId, tahsilat.tahsilatTutari)}>
                        İptal Et
                    </button>
                )}
                
            </td>
        </tr>
    ))}
</tbody>
            </table>
        </div>
    );
};

export default Tahsilatlar;

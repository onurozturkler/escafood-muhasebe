import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import "../index.css";

const Teklifler = () => {
    const [teklifler, setTeklifler] = useState([]);
    const [sortField, setSortField] = useState("teklifNo");
    const [sortOrder, setSortOrder] = useState("desc");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeklifler = async () => {
            const querySnapshot = await getDocs(collection(db, "teklifler"));
            let tekliflerData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const musteriSnapshot = await getDocs(collection(db, "musteriler"));
            const musteriMap = {};
            musteriSnapshot.docs.forEach(doc => {
                musteriMap[doc.id] = doc.data().musteriAdi;
            });

            tekliflerData = tekliflerData.map(teklif => ({
                ...teklif,
                musteriAdi: musteriMap[teklif.musteriId] || "Bilinmeyen Müşteri"
            }));

            setTeklifler(tekliflerData);
        };

        fetchTeklifler();
    }, []);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
        setTeklifler([...teklifler].sort((a, b) => {
            if (a[field] < b[field]) return order === "asc" ? -1 : 1;
            if (a[field] > b[field]) return order === "asc" ? 1 : -1;
            return 0;
        }));
    };

    const handleTeklifIptal = async (teklifId, musteriId, geneltoplamTutar) => {
        try {
            const onay = window.confirm("Bu teklifi iptal etmek istediğinizden emin misiniz?");
            if (onay) {
                const teklifRef = doc(db, "teklifler", teklifId);
                await updateDoc(teklifRef, { iptal: true });
                
                const musteriRef = doc(db, "musteriler", musteriId);
                const musteriSnap = await getDoc(musteriRef);
                if (musteriSnap.exists()) {
                    const mevcutCariHesap = musteriSnap.data().carihesap || 0;
                    await updateDoc(musteriRef, { carihesap: mevcutCariHesap + geneltoplamTutar });
                }
                
                alert("Teklif başarıyla iptal edildi ve cari hesap güncellendi!");
                window.location.reload();
            }
        } catch (error) {
            console.error("İptal işlemi başarısız: ", error);
            alert("Teklif iptal edilirken bir hata oluştu!");
        }
    };

    return (
        <div>
            <h2>Teklifler</h2>
         <button
  className="custom-button"
  style={{ marginBottom: "20px" }}
  onClick={() => navigate("/teklifler/yeni")}
>
  + Yeni Teklif Ekle
</button>


            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>
                            Teklif No&nbsp;&nbsp;   
                            <button onClick={() => handleSort("teklifNo")}>↕</button>
                        </th>
                        <th>
                            Tarih&nbsp;&nbsp;   
                            <button onClick={() => handleSort("tarih")}>↕</button>
                        </th>
                        <th>
                            Müşteri&nbsp;&nbsp;
                            <button onClick={() => handleSort("musteriAdi")}>↕</button>
                        </th>
                        <th>
                            Toplam Tutar&nbsp;&nbsp;
                            <button onClick={() => handleSort("geneltoplamTutar")}>↕</button>
                        </th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {teklifler.map(teklif => (
                        <tr key={teklif.id} style={{ textDecoration: teklif.iptal ? "line-through" : "none" }}>
                            <td>{teklif.teklifNo}</td>
                            <td>{new Date(teklif.tarih).toLocaleDateString("tr-TR")}</td>
                            <td>{teklif.musteriAdi}</td>
                            <td>₺{teklif.geneltoplamTutar ? parseFloat(teklif.geneltoplamTutar).toFixed(2) : "0.00"}</td>
                            <td>
                                <button onClick={() => navigate(`/teklifler/detay/${teklif.id}`)}>Detay</button>
                                {!teklif.iptal && <button onClick={() => handleTeklifIptal(teklif.id, teklif.musteriId, parseFloat(teklif.geneltoplamTutar))}>İptal</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Teklifler;

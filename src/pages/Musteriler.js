import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import * as XLSX from "xlsx";

const Musteriler = () => {
    const [musteriler, setMusteriler] = useState([]);
    const [sortField, setSortField] = useState("musteriAdi");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [yeniMusteri, setYeniMusteri] = useState({ musteriAdi: "", adres: "", carihesap: 0 });
    const navigate = useNavigate();
    const adminSifre = "12345";

    useEffect(() => {
        const fetchMusteriler = async () => {
            const querySnapshot = await getDocs(collection(db, "musteriler"));
            setMusteriler(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchMusteriler();
    }, []);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
        setMusteriler([...musteriler].sort((a, b) => {
            if (a[field] > b[field]) return order === "asc" ? 1 : -1;
            if (a[field] < b[field]) return order === "asc" ? -1 : 1;
            return 0;
        }));
    };

    const handleMusteriSil = async (id, musteriAdi) => {
        const onay = window.confirm(`${musteriAdi} adlı müşteriyi silmek istediğinize emin misiniz?`);
        if (!onay) return;

        await deleteDoc(doc(db, "musteriler", id));
        setMusteriler(musteriler.filter(musteri => musteri.id !== id));
        alert("Müşteri başarıyla silindi!");
    };

    const toplamCariHesap = musteriler.reduce((acc, musteri) => acc + (parseFloat(musteri.carihesap) || 0), 0);

    const handleYeniMusteriEkle = async () => {
        if (!yeniMusteri.musteriAdi || !yeniMusteri.adres) {
            alert("Lütfen müşteri adı ve adresini girin!");
            return;
        }

        const docRef = await addDoc(collection(db, "musteriler"), yeniMusteri);
        setMusteriler([...musteriler, { id: docRef.id, ...yeniMusteri }]);
        setYeniMusteri({ musteriAdi: "", adres: "", carihesap: 0 });
    };

    const handleTumMusterileriSil = async () => {
        const onay = window.confirm("Tüm müşterileri silmek istediğinizden emin misiniz?");
        if (!onay) return;

        const sifre = prompt("Tüm müşterileri silmek için yönetici şifresini girin:");
        if (sifre !== adminSifre) {
            alert("Şifre hatalı! Silme işlemi iptal edildi.");
            return;
        }

        for (let musteri of musteriler) {
            await deleteDoc(doc(db, "musteriler", musteri.id));
        }

        setMusteriler([]);
        alert("Tüm müşteriler başarıyla silindi!");
    };

    return (
        <div>
            <h2>Müşteriler</h2>
            <h3>Toplam Cari Hesap: <span style={{ color: toplamCariHesap < 0 ? 'red' : 'green' }}>
                ₺{toplamCariHesap.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span></h3>

            <h3>Yeni Müşteri Ekle</h3>
            <input
                type="text"
                placeholder="Müşteri Adı"
                value={yeniMusteri.musteriAdi}
                onChange={(e) => setYeniMusteri({ ...yeniMusteri, musteriAdi: e.target.value })}
            />
            <input
                type="text"
                placeholder="Adres"
                value={yeniMusteri.adres}
                onChange={(e) => setYeniMusteri({ ...yeniMusteri, adres: e.target.value })}
            />
            <input
                type="number"
                placeholder="Cari Hesap"
                value={yeniMusteri.carihesap}
                onChange={(e) => setYeniMusteri({ ...yeniMusteri, carihesap: parseFloat(e.target.value) || 0 })}
            />
            <button onClick={handleYeniMusteriEkle}>Müşteri Ekle</button>

            <h3>Müşteri Arama</h3>
            <input
                type="text"
                placeholder="Müşteri Adı Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />

            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("musteriAdi")}>Müşteri Adı</th>
                        <th onClick={() => handleSort("adres")}>Adres</th>
                        <th onClick={() => handleSort("carihesap")}>Cari Hesap</th>
                        <th>Detay</th>
                        <th>Sil</th>
                    </tr>
                </thead>
                <tbody>
                    {musteriler
                        .filter(musteri => musteri.musteriAdi.toLowerCase().includes(searchTerm))
                        .map(musteri => (
                            <tr key={musteri.id}>
                                <td>{musteri.musteriAdi}</td>
                                <td>{musteri.adres}</td>
                                <td style={{ color: musteri.carihesap < 0 ? 'red' : 'green' }}>
                                    ₺{parseFloat(musteri.carihesap).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/musteriler/detay/${musteri.id}`)}>Detay</button>
                                </td>
                                <td>
                                    <button onClick={() => handleMusteriSil(musteri.id, musteri.musteriAdi)} style={{ backgroundColor: "red", color: "white" }}>
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
                    <button onClick={handleTumMusterileriSil} style={{ backgroundColor: "darkred", color: "white", padding: "10px", marginTop: "10px" }}>
                Tüm Müşterileri Sil
            </button>
        </div>
    );
};

export default Musteriler;

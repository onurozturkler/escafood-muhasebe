import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDoc, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";



const TahsilatEkle = () => {
    const [musteriler, setMusteriler] = useState([]);
    const [secilenMusteri, setSecilenMusteri] = useState("");
    const [tahsilatTuru, setTahsilatTuru] = useState("Nakit");
    const [aciklama, setAciklama] = useState("");
    const [tahsilatTutari, setTahsilatTutari] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMusteriler = async () => {
            const querySnapshot = await getDocs(collection(db, "musteriler"));
            const musteriListesi = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.musteriAdi.localeCompare(b.musteriAdi));
            setMusteriler(musteriListesi);
        };
        fetchMusteriler();
    }, []);
const [tahsilatlar, setTahsilatlar] = useState([]);

const fetchTahsilatlar = async () => {
  const querySnapshot = await getDocs(collection(db, "tahsilatlar"));
  setTahsilatlar(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
};


const getNextTahsilatNo = async () => {
    const querySnapshot = await getDocs(collection(db, "tahsilatlar"));
    const tahsilatNos = querySnapshot.docs
        .map(doc => doc.data().tahsilatNo)
        .filter(num => num.startsWith("TH")) // "TH" ile başlayanları al
        .map(num => parseInt(num.replace("TH", ""), 10)) // "TH" kısmını çıkarıp sayıya çevir
        .filter(num => !isNaN(num)); // Sayı olmayanları çıkar

    return tahsilatNos.length > 0 ? `TH${Math.max(...tahsilatNos) + 1}` : "TH10001";
};

const handleTahsilatEkle = async () => {
    if (!secilenMusteri || !tahsilatTutari) {
        alert("Lütfen müşteri seçin ve geçerli bir tutar girin.");
        return;
    }

    const yeniTahsilatNo = await getNextTahsilatNo(); // ✅ Yeni tahsilat numarasını al

    const yeniTahsilat = {
        tahsilatNo: yeniTahsilatNo,
        tarih: Date.now(),
        musteriId: secilenMusteri,
        musteriAdi: musteriler.find(m => m.id === secilenMusteri)?.musteriAdi || "Bilinmeyen",
        tahsilatTuru,
        aciklama,
        tahsilatTutari: parseFloat(tahsilatTutari.replace(/,/g, "")),
    };

    // ✅ Yeni tahsilatı Firestore’a kaydet
    await addDoc(collection(db, "tahsilatlar"), yeniTahsilat);

    // ✅ Müşteri cari hesabını güncelle
    const musteriRef = doc(db, "musteriler", secilenMusteri);
    const musteriDoc = await getDoc(musteriRef);

    if (musteriDoc.exists()) {
        const musteriData = musteriDoc.data();
        const yeniCariHesap = (musteriData.carihesap || 0) + yeniTahsilat.tahsilatTutari;

        await updateDoc(musteriRef, { carihesap: yeniCariHesap });
    }

    alert("Tahsilat başarıyla eklendi!");
    
    fetchTahsilatlar(); // ✅ Tahsilat listesini güncelle

    // ✅ Sayfayı yenilemeden listeyi güncelle
    setTahsilatlar(prevTahsilatlar => [...prevTahsilatlar, yeniTahsilat]);
};

    return (
       <div className="form-container">
    <h2>Yeni Tahsilat Ekle</h2>

    <div className="form-group">
        <label>Müşteri:</label>
        <select value={secilenMusteri} onChange={(e) => setSecilenMusteri(e.target.value)}>
            <option value="">Seçiniz</option>
            {musteriler.map(musteri => (
                <option key={musteri.id} value={musteri.id}>{musteri.musteriAdi}</option>
            ))}
        </select>
    </div>

    <div className="form-group">
        <label>Tahsilat Türü:</label>
        <select value={tahsilatTuru} onChange={(e) => setTahsilatTuru(e.target.value)}>
            <option value="Nakit">Nakit</option>
            <option value="EFT/Havale">EFT/Havale</option>
            <option value="Senet">Senet</option>
            <option value="Çek">Çek</option>
            <option value="Diğer">Diğer</option>
        </select>
    </div>

    <div className="form-group">
        <label>Açıklama:</label>
        <input type="text" value={aciklama} onChange={(e) => setAciklama(e.target.value)} />
    </div>

    <div className="form-group">
        <label>Tutar:</label>
        <input type="text" value={tahsilatTutari} onChange={(e) => setTahsilatTutari(e.target.value.replace(/[^0-9,]/g, ""))} />
    </div>

    <button onClick={handleTahsilatEkle}>Tahsilat Ekle</button>
</div>

    );
};

export default TahsilatEkle;

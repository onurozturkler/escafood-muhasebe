import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, addDoc, doc, updateDoc, getDoc, query, orderBy } from "firebase/firestore";

function TeklifEkle() {
  const [musteriler, setMusteriler] = useState([]);
  const [urunler, setUrunler] = useState([]);
  const [secilenMusteri, setSecilenMusteri] = useState("");
  const [secilenUrun, setSecilenUrun] = useState(null);
  const [urunListesi, setUrunListesi] = useState([]);
  const [iskontoOrani, setIskontoOrani] = useState(0);
  const navigate = useNavigate();
  const getNextTeklifNo = async () => {
    const querySnapshot = await getDocs(collection(db, "teklifler"));
    const teklifNos = querySnapshot.docs
        .map(doc => doc.data().teklifNo)
        .filter(num => !isNaN(num));

};


    return teklifNos.length > 0 ? Math.max(...teklifNos) + 1 : 10001; // İlk teklif numarası 10001'den başlasın
};
  useEffect(() => {
    const fetchMusteriler = async () => {
      const querySnapshot = await getDocs(query(collection(db, "musteriler"), orderBy("musteriAdi")));
      setMusteriler(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    

    const fetchUrunler = async () => {
      const querySnapshot = await getDocs(query(collection(db, "urunler"), orderBy("urunAdi")));
      setUrunler(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchMusteriler();
    fetchUrunler();
  }, []);

  const handleUrunEkle = () => {
    if (!secilenUrun) {
      alert("Lütfen bir ürün seçin!");
      return;
    }
    setUrunListesi(prevList => [...prevList, {
      ...secilenUrun,
      miktar: 1,
      fiyat: parseFloat(secilenUrun.fiyat).toFixed(2),
      toplam: parseFloat(secilenUrun.fiyat).toFixed(2),
      barkod: secilenUrun.barkod || "0000000000000"
    }]);
  };

  const handleDegisim = (index, field, value) => {
    setUrunListesi(prevList => {
      const yeniListe = [...prevList];
      yeniListe[index][field] = value;

      if (field === "miktar" || field === "fiyat") {
        yeniListe[index].toplam = (parseFloat(yeniListe[index].miktar) * parseFloat(yeniListe[index].fiyat)).toFixed(2);
      }
      return yeniListe;
    });
  };

  const hesaplaToplam = () => {
    return urunListesi.reduce((acc, urun) => acc + parseFloat(urun.toplam), 0).toFixed(2);
  };

  const hesaplaIskontoluToplam = () => {
    return (hesaplaToplam() * (1 - iskontoOrani / 100)).toFixed(2);
  };
const hesaplaIskontoTutar = () => {
    return (hesaplaToplam() - hesaplaToplam()* (1 - iskontoOrani / 100) ).toFixed(2);
  };

  const handleTeklifKaydet = async () => {
    if (!secilenMusteri || urunListesi.length === 0) {
      alert("Lütfen müşteri seçin ve en az bir ürün ekleyin!");
      return;
    }

const teklifNo = await getNextTeklifNo();

    await addDoc(collection(db, "teklifler"), {
      musteriId: secilenMusteri,
      urunler: urunListesi,
      toplamTutar: hesaplaToplam(),
      iskontoTutar: hesaplaIskontoTutar(),
      geneltoplamTutar: hesaplaIskontoluToplam(),
      tarih: Date.now(),
      teklifNo: teklifNo,
    });

    // Müşteri cari hesap güncellemesi
    const musteriRef = doc(db, "musteriler", secilenMusteri);
    const musteriSnap = await getDoc(musteriRef);
    if (musteriSnap.exists()) {
      const mevcutCariHesap = musteriSnap.data().carihesap || 0;
      await updateDoc(musteriRef, { carihesap: mevcutCariHesap - parseFloat(hesaplaIskontoluToplam()) });
    }

    alert("Teklif kaydedildi ve müşteri cari hesabı güncellendi!");
    navigate("/teklifler");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Yeni Teklif Ekle</h2>

      <label>Müşteri Seç: </label>
      <select onChange={(e) => setSecilenMusteri(e.target.value)}>
        <option value="">Seçiniz</option>
        {musteriler.map(musteri => (
          <option key={musteri.id} value={musteri.id}>{musteri.musteriAdi}</option>
        ))}
      </select>

      <label>Ürün Seç: </label>
      <select onChange={(e) => setSecilenUrun(urunler.find(u => u.id === e.target.value))}>
        <option value="">Seçiniz</option>
        {urunler.map(urun => (
          <option key={urun.id} value={urun.id}>{urun.urunAdi} - ₺{parseFloat(urun.fiyat).toFixed(2)}</option>
        ))}
      </select>
      <button onClick={handleUrunEkle}>Ürün Ekle</button>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ borderCollapse: "collapse", width: "60%" }}>
        <thead>
          <tr>
            <th>Barkod</th>
            <th>Ürün Adı</th>
            <th>Miktar</th>
            <th>Fiyat</th>
            <th>Toplam</th>
          </tr>
        </thead>
        <tbody>
          {urunListesi.map((urun, index) => (
            <tr key={index}>
              <td>{urun.barkod}</td>
              <td>
                <input
                  type="text"
                  value={urun.urunAdi}
                  onChange={(e) => handleDegisim(index, "urunAdi", e.target.value)}
                  style={{ width: "400px" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={urun.miktar}
                  onChange={(e) => handleDegisim(index, "miktar", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value=(urun.fiyat)
                  onChange={(e) => handleDegisim(index, "fiyat", e.target.value)}
                />
              </td>
              <td>(urun.fiyat)</td>
            </tr>
          ))}
        </tbody>
      </table>

      <label>İskonto Oranı (%): </label>

      <input type="number" value={iskontoOrani} onChange={(e) => setIskontoOrani(parseFloat(e.target.value) || 0)} />
<h3>Toplam Tutar: ₺{formatCurrency(hesaplaToplam())}</h3>
<h3>İskonto Tutarı (%{iskontoOrani}): ₺{formatCurrency(hesaplaIskontoTutar())}</h3>
<h3>Genel Toplam: ₺{formatCurrency(hesaplaIskontoluToplam())}</h3>
      <button onClick={handleTeklifKaydet}>Teklif Kaydet</button>
    </div>
  );
}

export default TeklifEkle;

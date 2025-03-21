import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, addDoc, doc, updateDoc, getDoc, query, orderBy } from "firebase/firestore";
import "./TeklifEkle.css";
import "../index.css";


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

    return teklifNos.length > 0 ? Math.max(...teklifNos) + 1 : 10001; // İlk teklif numarası 10001'den başlasın
};
const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
    
  useEffect(() => {
    const fetchMusteriler = async () => {
      const querySnapshot = await getDocs(query(collection(db, "musteriler"), orderBy("musteriAdi")));
      setMusteriler(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };



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

    if (field === "urunAdi") {
      yeniListe[index] = {
        ...yeniListe[index],
        urunAdi: value,
        barkod: ""  // ✅ Ürün adı değiştiğinde barkod tamamen boşaltılacak
      };
    } else if (field === "miktar" || field === "fiyat") {
      const yeniMiktar = field === "miktar" ? parseFloat(value) || 0 : parseFloat(yeniListe[index].miktar) || 0;
      const yeniFiyat = field === "fiyat" ? parseFloat(value) || 0 : parseFloat(yeniListe[index].fiyat) || 0;

      yeniListe[index] = {
        ...yeniListe[index],
        [field]: parseFloat(value) || 0,  
        toplam: yeniMiktar * yeniFiyat // ✅ Doğru hesaplama artık yeni girilen değerleri baz alıyor!
      };
    } else {
      yeniListe[index][field] = value;
    }
    return yeniListe;
  });
};




const hesaplaToplam = () => {
    return urunListesi.reduce((acc, urun) => acc + (parseFloat(urun.toplam) || 0), 0).toFixed(2);
};

  const hesaplaIskontoluToplam = () => {
    return (hesaplaToplam() * (1 - iskontoOrani / 100)).toFixed(2);
  };
const hesaplaIskontoTutar = () => {
    return (hesaplaToplam() - hesaplaToplam()* (1 - iskontoOrani / 100) ).toFixed(2);
  };
const handleUrunSil = (index) => {
  setUrunListesi(prevList => prevList.filter((_, i) => i !== index));
};

const handleTeklifKaydet = async () => {
  if (!secilenMusteri || urunListesi.length === 0) {
    alert("Lütfen müşteri seçin ve en az bir ürün ekleyin!");
    return;
  }

  const teklifNo = await getNextTeklifNo();
  const iskontoDegeri = iskontoOrani || 0;
  const iskontoTutarDegeri = hesaplaIskontoTutar() || "0.00";
  const genelToplamDegeri = hesaplaIskontoluToplam() || "0.00";

  let yeniUrunlerListesi = [...urunListesi];

  for (let i = 0; i < yeniUrunlerListesi.length; i++) {
    if (!yeniUrunlerListesi[i].barkod) {
      const yeniUrunKaydedilsinMi = window.confirm(`Yeni ürün "${yeniUrunlerListesi[i].urunAdi}" kaydedilsin mi?`);
      
      if (yeniUrunKaydedilsinMi) {
        const yeniBarkodBelirlensinMi = window.confirm("Yeni ürün için barkod belirlensin mi?");
        
        let yeniBarkod = "";

        if (yeniBarkodBelirlensinMi) {
          yeniBarkod = prompt("Lütfen 13 haneli yeni bir barkod girin:");
          if (!yeniBarkod || yeniBarkod.length !== 13 || isNaN(yeniBarkod)) {
            alert("Geçersiz barkod! Varsayılan olarak 0000000000000 atanacak.");
            yeniBarkod = "0000000000000";
          }
        } else {
          yeniBarkod = "0000000000000";  // ✅ Barkod belirlenmezse "0000000000000" atanacak
        }

        yeniUrunlerListesi[i].barkod = yeniBarkod;

        // ✅ Yeni ürünü Firestore’a ekleyelim
        await addDoc(collection(db, "urunler"), {
          urunAdi: yeniUrunlerListesi[i].urunAdi,
          barkod: yeniBarkod,
          fiyat: yeniUrunlerListesi[i].fiyat,
          stok: 0  // ✅ Stok her zaman 0 olacak
        });
      } else {
        yeniUrunlerListesi[i].barkod = "0000000000000"; 
      }
    }
  }

  // ✅ **Teklifi Firestore’a kaydet**
  await addDoc(collection(db, "teklifler"), {
    musteriId: secilenMusteri,
    urunler: yeniUrunlerListesi,
    toplamTutar: hesaplaToplam(),
    iskontoOrani: iskontoDegeri,
    iskontoTutar: iskontoTutarDegeri,
    geneltoplamTutar: genelToplamDegeri,
    tarih: Date.now(),
    teklifNo: teklifNo,
  });

  // ✅ **Müşteri cari hesabını güncelle**
  const musteriRef = doc(db, "musteriler", secilenMusteri);
  const musteriSnap = await getDoc(musteriRef);

  if (musteriSnap.exists()) {
    const mevcutCariHesap = musteriSnap.data().carihesap || 0;
    const yeniCariHesap = mevcutCariHesap - parseFloat(genelToplamDegeri);

    // **Güncellenmiş cari hesap değerini Firestore’a yaz**
    await updateDoc(musteriRef, { carihesap: yeniCariHesap });

    // **Test için console.log ekleyelim**
    console.log("Mevcut Cari Hesap:", mevcutCariHesap);
    console.log("Genel Toplam:", genelToplamDegeri);
    console.log("Yeni Cari Hesap:", yeniCariHesap);
  }

  alert("Teklif kaydedildi ve müşteri cari hesabı güncellendi!");
  navigate("/teklifler");
};

  return (
<div className="teklif-container">
  <h2 className="teklif-title">Yeni Teklif Ekle</h2>

  <div className="teklif-form">
    <label>Müşteri Seç:</label>
   <select onChange={(e) => setSecilenMusteri(e.target.value)}>
  <option value="">Seçiniz</option>
  {musteriler
    .sort((a, b) => a.musteriAdi.localeCompare(b.musteriAdi)) // ✅ Eğer sıralama Firestore’da yoksa, burada alfabetik sırala
    .map(musteri => (
      <option key={musteri.id} value={musteri.id}>{musteri.musteriAdi}</option>
    ))}
</select>

    <label>Ürün Seç:</label>
    <select onChange={(e) => setSecilenUrun(urunler.find(u => u.id === e.target.value))}>
      <option value="">Seçiniz</option>
      {urunler.map(urun => (
        <option key={urun.id} value={urun.id}>{urun.urunAdi} - ₺{parseFloat(urun.fiyat).toFixed(2)}</option>
      ))}
    </select>
    <button className="teklif-button" onClick={handleUrunEkle}>Ürün Ekle</button>
  </div>

  <table className="teklif-table">
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
              style={{ width: "200px" }}
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
              value={urun.fiyat}
              onChange={(e) => handleDegisim(index, "fiyat", e.target.value)}
            />
          </td>
          <td>₺{formatCurrency(urun.toplam)}</td>

<td>
  <button className="silme-buton" onClick={() => handleUrunSil(index)}>❌</button>
</td>

        </tr>
      ))}
    </tbody>
  </table>

<label>İskonto Oranı (%):</label>
<input
  type="number"
  value={iskontoOrani}
  onChange={(e) => setIskontoOrani(parseFloat(e.target.value) || 0)}
  style={{ width: "100px", marginLeft: "10px" }}
/>
<h3>Toplam Tutar: ₺{formatCurrency(hesaplaToplam())}</h3>
<h3>İskonto Tutarı (%{iskontoOrani}): ₺{formatCurrency(hesaplaIskontoTutar())}</h3>
<h3>Genel Toplam: ₺{formatCurrency(hesaplaIskontoluToplam())}</h3>

  <button className="teklif-button" onClick={handleTeklifKaydet}>Teklif Kaydet</button>
</div>





  );
}

export default TeklifEkle;

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import "../index.css";

function Urunler() {
  const [urunler, setUrunler] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [yeniUrun, setYeniUrun] = useState({ barkod: "", urunAdi: "", fiyat: "", stok: "" });
  const [selectedFileName, setSelectedFileName] = useState("Excel Dosyası ile Ürün Listesi Ekleme : barkod ; urunAdi ; fiyat ; stok sütunları içermeli.");

  useEffect(() => {
    const fetchUrunler = async () => {
      const querySnapshot = await getDocs(collection(db, "urunler"));
      const urunlerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUrunler(urunlerList);
    };

    fetchUrunler();
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    const sortedUrunler = [...urunler].sort((a, b) => {
      if (!isNaN(a[field]) && !isNaN(b[field])) {
        return order === "asc" ? a[field] - b[field] : b[field] - a[field];
      }
      return order === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
    });
    setUrunler(sortedUrunler);
  };

  const handleYeniUrunEkle = async () => {
    if (!yeniUrun.barkod || !yeniUrun.urunAdi || !yeniUrun.fiyat || !yeniUrun.stok) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }
    await addDoc(collection(db, "urunler"), yeniUrun);
    alert("Ürün başarıyla eklendi!");
    window.location.reload();
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      for (let urun of jsonData) {
        await addDoc(collection(db, "urunler"), urun);
      }
      alert("Ürünler başarıyla yüklendi!");
      window.location.reload();
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ürünler</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="mb-4 border p-2" />

<h3 className="text-xl font-bold mb-5"> Yeni Ürün </h3>

      <div className="mb-4">
        <input type="text" placeholder="Barkod" value={yeniUrun.barkod} onChange={(e) => setYeniUrun({ ...yeniUrun, barkod: e.target.value })} className="border p-2 mr-2" />
        <input type="text" placeholder="Ürün Adı" value={yeniUrun.urunAdi} onChange={(e) => setYeniUrun({ ...yeniUrun, urunAdi: e.target.value })} className="border p-2 mr-2" />
        <input type="number" placeholder="Fiyat" value={yeniUrun.fiyat} onChange={(e) => setYeniUrun({ ...yeniUrun, fiyat: e.target.value })} className="border p-2 mr-2" />
        <input type="number" placeholder="Stok" value={yeniUrun.stok} onChange={(e) => setYeniUrun({ ...yeniUrun, stok: e.target.value })} className="border p-2 mr-2" />
        <button onClick={handleYeniUrunEkle} className="bg-blue-500 text-white p-2">Ekle</button>
      </div>

<h2 className="text-2xl font-bold mb-4"></h2>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ borderCollapse: "collapse", width: "60%" }}>
        <thead>
          <tr style={{ backgroundColor: "#e40000", color: "white", cursor: "pointer" }}>
            <th onClick={() => handleSort("id")} style={{ border: "1px solid black", padding: "8px" }}>Sıra No</th>
            <th onClick={() => handleSort("barkod")} style={{ border: "1px solid black", padding: "8px" }}>Barkod</th>
            <th onClick={() => handleSort("urunAdi")} style={{ border: "1px solid black", padding: "8px" }}>Ürün Adı</th>
            <th onClick={() => handleSort("fiyat")} style={{ border: "1px solid black", padding: "8px" }}>Fiyat</th>
            <th onClick={() => handleSort("stok")} style={{ border: "1px solid black", padding: "8px" }}>Stok</th>
          </tr>
        </thead>


        <tbody>
          {urunler.map((urun, index) => (
            <tr key={urun.id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{urun.barkod}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{urun.urunAdi}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>₺{parseFloat(urun.fiyat).toFixed(2)}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{urun.stok} Adet</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Urunler;

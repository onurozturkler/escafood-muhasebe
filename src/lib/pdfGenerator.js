import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../poppins"; // Türkçe karakter destekli Poppins fontu

export function generateTahsilatPDF(tahsilat, musteri) {
    const doc = new jsPDF();

    doc.setFont("Poppins", "bold"); // ✅ Sadece Poppins fontu
    doc.setFontSize(20);
    doc.text("Tahsilat Makbuzu", 80, 20);

    doc.setFont("Poppins", "bold");
    doc.setFontSize(13);
    doc.text("ESCA FOOD GIDA DIŞ TİCARET SANAYİ ANONİM ŞİRKETİ", 14, 40);
doc.setFont("Poppins", "normal");
    doc.text("Yeni Bağlıca Mah. Etimesgut Blv No: 6H/A", 14, 50);
    doc.text("Etimesgut, ANKARA – Türkiye", 14, 60);
    doc.text("Vergi No: 3770983099 (Etimesgut)", 14, 70);
doc.setFont("Poppins", "bold");
    doc.setFontSize(13);
    doc.text("Sayın;", 14, 90);
    doc.setFont("Poppins", "normal");
    doc.text(musteri.musteriAdi || "-", 14, 95);
    doc.setFont("Poppins", "bold");
    doc.text("Adres:", 14, 100);
doc.setFont("Poppins", "normal");
    const wrappedAddress = doc.splitTextToSize(musteri.adres || "-", 160);
    doc.text(wrappedAddress, 40, 100);

    const formatNumber = (num) => {
        return new Intl.NumberFormat("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const tahsilatTutari = formatNumber(tahsilat.tahsilatTutari);
    const tahsilatSonrasiCariHesap = formatNumber((musteri.carihesap || 0) - tahsilat.tahsilatTutari);

    autoTable(doc, {
        startY: 120,
        head: [["Belge No", "Tarih", "Tahsilat Türü", "Açıklama", "Tahsilat Tutarı"]],
        body: [[
            tahsilat.tahsilatNo || "-",
            new Date(tahsilat.tarih || Date.now()).toLocaleDateString("tr-TR"),
            tahsilat.tahsilatTuru || "-",
            tahsilat.aciklama || "-",
            tahsilatTutari
        ]],
        styles: {
        fontSize: 10,
        font: "Poppins", // Buraya font adını yaz
    },
    });

    const finalY = doc.lastAutoTable.finalY || 140;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tahsilat Toplamı: ${tahsilatTutari}`, 14, finalY + 10);

    const isNegatif = tahsilatSonrasiCariHesap.includes("-");
    doc.setTextColor(isNegatif ? "red" : "black");
    doc.text(`Tahsilat Sonrası Cari Hesap: ${tahsilatSonrasiCariHesap}`, 14, finalY + 20);

    doc.save(`Tahsilat_Makbuzu_${tahsilat.tahsilatNo || "Bilinmiyor"}.pdf`);
}

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../poppins"; // Türkçe karakter destekli Poppins fontu

export function generateTahsilatPDF(tahsilat, musteri) {
    const doc = new jsPDF();

    doc.setFont("Poppins", "normal"); // ✅ Sadece Poppins fontu
    doc.setFontSize(18);
    doc.text("Tahsilat Makbuzu", 80, 20);

    doc.setFontSize(12);
    doc.text("ESCA FOOD GIDA DIŞ TİCARET SANAYİ ANONİM ŞİRKETİ", 14, 40);
    doc.text("Yeni Bağlıca Mah. Etimesgut Blv No: 6H/A", 14, 50);
    doc.text("Etimesgut, ANKARA – Türkiye", 14, 60);
    doc.text("Vergi No: 3770983099 (Etimesgut)", 14, 70);

    doc.setFontSize(14);
    doc.text("Sayın:", 14, 90);
    doc.text(musteri.musteriAdi || "-", 40, 90);
    doc.text("Adres:", 14, 100);

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
        styles: { fontSize: 10 },
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

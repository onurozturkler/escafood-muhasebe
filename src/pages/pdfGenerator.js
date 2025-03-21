import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../index.css";

export function generateTahsilatPDF(tahsilat, musteri) {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal"); // ✅ Doğru font adı kullanıldı

    const cleanText = (text) => {
        if (!text) return "-";
        return String(text).normalize("NFC");
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    };

    doc.setFontSize(18);
    doc.text("Tahsilat Makbuzu", 80, 20);

    doc.setFontSize(12);
    doc.text(cleanText("ESCA FOOD GIDA DIŞ TİCARET SANAYİ ANONİM ŞİRKETİ"), 14, 40);
    doc.text(cleanText("Yeni Bağlıca Mah. Etimesgut Blv No: 6H/A"), 14, 50);
    doc.text(cleanText("Etimesgut, ANKARA – Türkiye"), 14, 60);
    doc.text(cleanText("Vergi No: 3770983099 (Etimesgut)"), 14, 70);

    doc.setFontSize(14);
    doc.text("Sayın:", 14, 90);
    doc.text(cleanText(musteri.musteriAdi), 40, 90);
    doc.text("Adres:", 14, 100);

    const wrappedAddress = doc.splitTextToSize(cleanText(musteri.adres), 160);
    doc.text(wrappedAddress, 40, 100);

    const tahsilatTutari = formatNumber(tahsilat.tahsilatTutari);
    const tahsilatSonrasiCariHesap = formatNumber((musteri.carihesap || 0) - tahsilat.tahsilatTutari);

    autoTable(doc, {
        startY: 120,
        head: [["Belge No", "Tarih", "Tahsilat Türü", "Açıklama", "Tahsilat Tutarı"]],
        body: [[
            cleanText(tahsilat.tahsilatNo) || "-",
            new Date(tahsilat.tarih || Date.now()).toLocaleDateString("tr-TR"),
            cleanText(tahsilat.tahsilatTuru) || "-",
            cleanText(tahsilat.aciklama) || "-",
            tahsilatTutari
        ]],
        styles: { fontSize: 10 },
    });

    const finalY = doc.lastAutoTable.finalY || 140;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tahsilat Toplamı: ${tahsilatTutari}`, 14, finalY + 10);

    doc.setTextColor(tahsilatSonrasiCariHesap.includes("-") ? "red" : "black");
    doc.text(`Tahsilat Sonrası Cari Hesap: ${tahsilatSonrasiCariHesap}`, 14, finalY + 20);

    doc.save(`Tahsilat_Makbuzu_${cleanText(tahsilat.tahsilatNo) || "Bilinmiyor"}.pdf`);
}

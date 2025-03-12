import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateTahsilatPDF(tahsilat: TahsilatData, musteri: MusteriData): void {
  const doc = new jsPDF();
  doc.setFont("times", "normal"); // ✅ Times New Roman ile tam Türkçe desteği
  doc.setLanguage("tr");

  // 📌 Bozuk karakterleri temizle ve Türkçe karakterleri koru
  const cleanText = (text: string | undefined): string => {
    if (!text) return "-";
    try {
      return decodeURIComponent(escape(text)); // ✅ UTF-8 formatına dönüştür
    } catch (error) {
      return text;
    }
  };

  // 📌 Sayı formatlayıcı fonksiyon
  const formatNumber = (num: number): string => {
    const formattedNum = num.toFixed(2).replace(".", ",");
    return `₺${formattedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // 📌 Şirket Bilgileri
  doc.setFontSize(18);
  doc.text("Tahsilat Makbuzu", 80, 20);
  doc.setFontSize(12);
  doc.text(cleanText("ESCA FOOD GIDA DIŞ TİCARET SANAYİ ANONİM ŞİRKETİ"), 14, 40);
  doc.text(cleanText("Yeni Bağlıca Mah Etimesgut Blv No: 6H/A"), 14, 50);
  doc.text(cleanText("Etimesgut, ANKARA – Türkiye"), 14, 60);
  doc.text(cleanText("Vergi No: 3770983099 (Etimesgut)"), 14, 70);

  // 📌 Müşteri Bilgileri
  doc.setFontSize(14);
  doc.text("Sayın:", 14, 90);
  doc.text(cleanText(musteri.musteriAdi), 40, 90);
  doc.text("Adres:", 14, 100);
  doc.text(doc.splitTextToSize(cleanText(musteri.adres), 160), 40, 100);

  // 📌 Sayıları düzgün formatla
  const tahsilatTutari = formatNumber(tahsilat.tahsilatTutari);
  const tahsilatSonrasiCariHesap = formatNumber((musteri.carihesap || 0) - tahsilat.tahsilatTutari);

  // 📌 Tahsilat Tablosu
  autoTable(doc, {
    startY: 120,
    head: [["Belge No", "Tarih", "Tahsilat Türü", "Açıklama", "Tahsilat Tutarı"]],
    body: [[
      cleanText(tahsilat.tahsilatNo),
      new Date(tahsilat.tarih || Date.now()).toLocaleDateString("tr-TR"),
      cleanText(tahsilat.tahsilatTuru),
      cleanText(tahsilat.aciklama),
      tahsilatTutari
    ]],
    styles: { fontSize: 10 },
  });

  // 📌 Toplam Tutar
  const finalY = (doc as any).lastAutoTable.finalY || 140; // ✅ `finalY` doğru şekilde belirlendi
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Tahsilat Toplamı: ${tahsilatTutari}`, 14, finalY + 10);

  // 📌 Tahsilat sonrası cari hesap (Eksi değerleri kırmızı yap)
  doc.setTextColor(tahsilatSonrasiCariHesap.includes("-") ? "red" : "black");
  doc.text(`Tahsilat Sonrası Cari Hesap: ${tahsilatSonrasiCariHesap}`, 14, finalY + 20);

  doc.save(`Tahsilat_Makbuzu_${cleanText(tahsilat.tahsilatNo) || "Bilinmiyor"}.pdf`);
}

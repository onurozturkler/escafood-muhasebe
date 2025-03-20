#!/bin/bash
echo "📢 Güncellemeler hazırlanıyor..."
git add .
git commit -m "Auto commit: Güncelleme yapıldı"
git pull --rebase origin main
git push origin main
echo "📦 GitHub'a yüklendi!"

echo "🚀 Firebase'e deploy ediliyor..."
npm install
npm run build
firebase deploy --force
echo "🎉 Güncelleme tamamlandı!"

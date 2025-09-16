# سكريبت سريع لرفع التحديثات
Write-Host "🚀 رفع سريع إلى GitHub..." -ForegroundColor Green

git add .
git commit -m "🔄 تحديث سريع - $(Get-Date -Format 'HH:mm:ss')"
git push origin main 2>$null || git push origin master

Write-Host "✅ تم!" -ForegroundColor Green

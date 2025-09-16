Write-Host "بدء تشغيل نظام حجز مواعيد الدكتور..." -ForegroundColor Green
Write-Host ""

Write-Host "بدء تشغيل الخادم..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd server && node simple-server.js" -WindowStyle Normal

Write-Host "انتظار 3 ثواني..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "بدء تشغيل العميل..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd client && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "تم بدء تشغيل النظام!" -ForegroundColor Green
Write-Host "الخادم: http://localhost:5000" -ForegroundColor Blue
Write-Host "العميل: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "اضغط أي مفتاح للخروج..." -ForegroundColor Magenta
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


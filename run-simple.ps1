Write-Host "========================================" -ForegroundColor Green
Write-Host "   تشغيل نظام حجز مواعيد الدكتور" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "جاري تشغيل الخادم..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node simple-server.js"

Write-Host ""
Write-Host "انتظر 3 ثواني..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "جاري تشغيل العميل..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   تم تشغيل النظام!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "الخادم: http://localhost:5000" -ForegroundColor Cyan
Write-Host "العميل: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "بيانات تسجيل الدخول:" -ForegroundColor Yellow
Write-Host "الدكتور: doctor@example.com / 123456" -ForegroundColor White
Write-Host "الإدارة: admin@example.com / admin123" -ForegroundColor White
Write-Host ""
Read-Host "اضغط Enter للخروج"

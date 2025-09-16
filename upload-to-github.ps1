Write-Host "========================================" -ForegroundColor Green
Write-Host "    رفع المشروع على GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. تأكد من أنك سجلت دخول إلى GitHub" -ForegroundColor Yellow
Write-Host "2. أنشئ repository جديد باسم: doctor-booking-system" -ForegroundColor Yellow
Write-Host "3. اضغط Enter للمتابعة..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "بدء رفع المشروع..." -ForegroundColor Cyan

# إنشاء Git repository
git init

# إضافة جميع الملفات
git add .

# كتابة رسالة commit
git commit -m "Initial commit - Doctor booking system"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    الخطوة التالية:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. اذهب إلى GitHub" -ForegroundColor Yellow
Write-Host "2. افتح repository الذي أنشأته" -ForegroundColor Yellow
Write-Host "3. انسخ رابط الـ repository" -ForegroundColor Yellow
Write-Host "4. اضغط Enter للمتابعة..." -ForegroundColor Yellow
Read-Host

Write-Host ""
$repoUrl = Read-Host "أدخل رابط الـ repository (https://github.com/YOUR_USERNAME/doctor-booking-system.git)"

# ربط بالـ repository
git remote add origin $repoUrl

# رفع الملفات
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    تم رفع المشروع بنجاح!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "يمكنك الآن رؤية مشروعك على GitHub" -ForegroundColor Blue
Write-Host "اضغط Enter للخروج..." -ForegroundColor Yellow
Read-Host


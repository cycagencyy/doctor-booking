@echo off
echo ========================================
echo    رفع المشروع على GitHub
echo ========================================
echo.

echo 1. تأكد من أنك سجلت دخول إلى GitHub
echo 2. أنشئ repository جديد باسم: doctor-booking-system
echo 3. اضغط Enter للمتابعة...
pause

echo.
echo بدء رفع المشروع...

REM إنشاء Git repository
git init

REM إضافة جميع الملفات
git add .

REM كتابة رسالة commit
git commit -m "Initial commit - Doctor booking system"

echo.
echo ========================================
echo    الخطوة التالية:
echo ========================================
echo.
echo 1. اذهب إلى GitHub
echo 2. افتح repository الذي أنشأته
echo 3. انسخ رابط الـ repository
echo 4. اضغط Enter للمتابعة...
pause

echo.
echo أدخل رابط الـ repository:
set /p repo_url="https://github.com/YOUR_USERNAME/doctor-booking-system.git: "

REM ربط بالـ repository
git remote add origin %repo_url%

REM رفع الملفات
git push -u origin main

echo.
echo ========================================
echo    تم رفع المشروع بنجاح!
echo ========================================
echo.
echo يمكنك الآن رؤية مشروعك على GitHub
echo اضغط Enter للخروج...
pause


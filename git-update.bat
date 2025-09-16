@echo off
chcp 65001 >nul
title GitHub Auto Update Script

echo 🚀 بدء رفع التحديثات إلى GitHub...

REM التحقق من وجود Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git غير مثبت على النظام!
    pause
    exit /b 1
)

REM التحقق من وجود repository
if not exist ".git" (
    echo ❌ هذا المجلد ليس Git repository!
    echo يرجى تشغيل 'git init' أولاً
    pause
    exit /b 1
)

REM إضافة جميع الملفات
echo 📁 إضافة الملفات...
git add .

REM التحقق من وجود تغييرات
git diff --cached --quiet
if errorlevel 1 (
    echo ✅ توجد تغييرات جديدة
) else (
    echo ✅ لا توجد تغييرات جديدة!
    pause
    exit /b 0
)

REM إنشاء رسالة commit تلقائية
for /f "tokens=1-6 delims=: " %%a in ("%time%") do set timestamp=%%a:%%b:%%c
set commitMessage=🔄 تحديث تلقائي - %date% %timestamp%

echo 💾 إنشاء commit...
git commit -m "%commitMessage%"

REM التحقق من وجود remote origin
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ لا يوجد remote origin!
    echo يرجى إضافة remote origin أولاً:
    echo git remote add origin ^<your-repo-url^>
    pause
    exit /b 1
)

REM رفع التحديثات
echo ⬆️ رفع التحديثات إلى GitHub...
git push origin main
if errorlevel 1 (
    echo 🔄 محاولة رفع إلى master...
    git push origin master
    if errorlevel 1 (
        echo ❌ فشل في رفع التحديثات!
        pause
        exit /b 1
    ) else (
        echo ✅ تم رفع التحديثات بنجاح إلى master!
    )
) else (
    echo ✅ تم رفع التحديثات بنجاح!
)

echo 🎉 تم الانتهاء بنجاح!
echo ⏰ الوقت: %date% %time%
pause

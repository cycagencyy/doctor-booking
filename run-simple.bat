@echo off
echo ========================================
echo    تشغيل نظام حجز مواعيد الدكتور
echo ========================================
echo.

echo جاري تشغيل الخادم...
start "Server" cmd /k "cd server && node simple-server.js"

echo.
echo انتظر 3 ثواني...
timeout /t 3 /nobreak > nul

echo.
echo جاري تشغيل العميل...
start "Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo    تم تشغيل النظام!
echo ========================================
echo.
echo الخادم: http://localhost:5000
echo العميل: http://localhost:3000
echo.
echo بيانات تسجيل الدخول:
echo الدكتور: doctor@example.com / 123456
echo الإدارة: admin@example.com / admin123
echo.
pause


@echo off
echo بدء تشغيل نظام حجز مواعيد الدكتور...
echo.

echo بدء تشغيل الخادم...
start "Server" cmd /k "cd server && node simple-server.js"

echo انتظار 3 ثواني...
timeout /t 3 /nobreak > nul

echo بدء تشغيل العميل...
start "Client" cmd /k "cd client && npm start"

echo.
echo تم بدء تشغيل النظام!
echo الخادم: http://localhost:5000
echo العميل: http://localhost:3000
echo.
echo اضغط أي مفتاح للخروج...
pause > nul


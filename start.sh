#!/bin/bash

echo "========================================"
echo "   نظام حجز مواعيد الدكتور"
echo "========================================"
echo

echo "جاري تثبيت التبعيات..."
npm install

echo
echo "جاري تثبيت تبعيات الخادم..."
cd server
npm install

echo
echo "جاري تثبيت تبعيات العميل..."
cd ../client
npm install

echo
echo "========================================"
echo "   تم التثبيت بنجاح!"
echo "========================================"
echo
echo "لتشغيل المشروع:"
echo "1. تأكد من تشغيل MongoDB"
echo "2. قم بتعديل ملف server/config.env"
echo "3. شغل: npm run dev"
echo
echo "أو شغل الخادم والعميل منفصلين:"
echo "- npm run server (الخادم)"
echo "- npm run client (العميل)"
echo


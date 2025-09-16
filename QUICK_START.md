# دليل البدء السريع - نظام حجز مواعيد الدكتور

## 🚀 التشغيل السريع

### 1. تثبيت التبعيات
```bash
# Windows
start.bat

# Linux/Mac
./start.sh

# أو يدوياً
npm run install-all
```

### 2. إعداد قاعدة البيانات
```bash
# تشغيل MongoDB محلياً
mongod

# أو استخدام MongoDB Atlas (سحابي)
# قم بتحديث MONGODB_URI في server/config.env
```

### 3. إعداد البريد الإلكتروني
```bash
# نسخ ملف الإعدادات
cp server/config.env.example server/config.env

# تعديل الإعدادات
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

### 4. تشغيل المشروع
```bash
# تشغيل الخادم والعميل معاً
npm run dev

# أو منفصلين
npm run server  # الخادم على المنفذ 5000
npm run client  # العميل على المنفذ 3000
```

## 🔑 بيانات تسجيل الدخول الافتراضية

### الإدارة
- **البريد الإلكتروني**: admin@example.com
- **كلمة المرور**: admin123

### الدكتور
- **البريد الإلكتروني**: doctor@example.com
- **كلمة المرور**: 123456
- **ملاحظة**: يمكن إنشاء دكتور افتراضي من صفحة تسجيل الدخول

## 📱 استخدام النظام

### للعملاء
1. زيارة: http://localhost:3000
2. النقر على "احجز موعدك الآن"
3. اختيار التاريخ والوقت
4. إدخال بيانات المريض
5. تأكيد الحجز

### للدكتور
1. زيارة: http://localhost:3000/doctor/login
2. تسجيل الدخول أو إنشاء دكتور افتراضي
3. عرض حجوزات اليوم
4. تأكيد أو إلغاء المواعيد

### للإدارة
1. زيارة: http://localhost:3000/admin/login
2. تسجيل الدخول بالبيانات الافتراضية
3. عرض جميع الحجوزات
4. إدارة الحالات والإحصائيات

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة

**خطأ في الاتصال بقاعدة البيانات**
```bash
# تأكد من تشغيل MongoDB
mongod --version

# تحقق من الرابط في config.env
MONGODB_URI=mongodb://localhost:27017/doctor-booking
```

**خطأ في إرسال البريد الإلكتروني**
```bash
# تأكد من إعدادات Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # كلمة مرور التطبيق
```

**خطأ في المنافذ**
```bash
# تأكد من عدم استخدام المنافذ
# الخادم: 5000
# العميل: 3000
```

## 📁 هيكل المشروع

```
doctor-booking-system/
├── client/          # واجهة المستخدم (React)
├── server/          # الخادم (Node.js)
├── package.json     # ملف المشروع الرئيسي
├── README.md        # دليل شامل
└── QUICK_START.md   # هذا الملف
```

## 🔧 تخصيص النظام

### تغيير ساعات العمل
```javascript
// server/models/Doctor.js
workingHours: {
  start: '08:00',
  end: '20:00'
}
```

### تغيير مدة الموعد
```javascript
// server/models/Appointment.js
duration: {
  default: 30,  // بالدقائق
  min: 15,
  max: 120
}
```

### إضافة مواعيد جديدة
```javascript
// server/models/Appointment.js
getAvailableTimeSlots() {
  return [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    // إضافة مواعيد حسب الحاجة
  ];
}
```

## 📞 الدعم

- **GitHub Issues**: للإبلاغ عن المشاكل
- **Documentation**: README.md للتفاصيل الكاملة
- **Email**: للدعم الفني

---

**نظام حجز مواعيد الدكتور - سهل الاستخدام وآمن ومتطور** 🏥✨


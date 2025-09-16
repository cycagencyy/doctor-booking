# 🏥 نظام حجز مواعيد الدكتور

نظام شامل لإدارة حجوزات المواعيد الطبية مع واجهة إدارية متقدمة.

## ✨ المميزات

### للمرضى:
- 📅 حجز مواعيد جديدة
- 🔍 عرض المواعيد المتاحة
- 📝 إدخال البيانات الشخصية
- ⏰ اختيار التاريخ والوقت المناسب

### للإدارة:
- 📊 لوحة تحكم شاملة
- 🔍 فلترة متقدمة (التاريخ، الحالة، البحث)
- 📈 إحصائيات مفصلة
- 📧 إرسال التقارير بالبريد الإلكتروني
- 📄 تصدير التقارير (CSV)
- ⚙️ إدارة الحجوزات

### للدكتور:
- 🔐 تسجيل دخول آمن
- 📋 عرض الحجوزات
- ✅ تحديث حالة الحجوزات

## 🚀 التشغيل السريع

### الطريقة الأولى: التشغيل المحلي
```bash
# 1. تشغيل الخادم
cd server
npm install
node simple-server.js

# 2. تشغيل العميل (في terminal جديد)
cd client
npm install
npm start
```

### الطريقة الثانية: استخدام ملفات التشغيل
```bash
# Windows
start-all.bat

# PowerShell
./start-all.ps1
```

### الطريقة الثالثة: Docker
```bash
docker-compose up -d
```

## 🌐 النشر على الإنترنت

### 1. نشر مجاني (Vercel + Railway)

#### العميل (Vercel):
1. اذهب إلى https://vercel.com
2. سجل حساب جديد
3. ارفع مجلد `client`
4. اضغط Deploy

#### الخادم (Railway):
1. اذهب إلى https://railway.app
2. سجل حساب جديد
3. ارفع مجلد `server`
4. اضغط Deploy

### 2. نشر احترافي (Docker)

```bash
# بناء الصورة
docker build -t doctor-booking .

# تشغيل الحاوية
docker run -p 5000:5000 doctor-booking
```

## ⚙️ الإعدادات

### متغيرات البيئة (server/config.env):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doctor-booking
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DEFAULT_DOCTOR_EMAIL=doctor@example.com
```

### إعداد البريد الإلكتروني:
1. فعل "App Passwords" في Gmail
2. استخدم كلمة المرور الخاصة بالتطبيق
3. ضع البيانات في ملف config.env

## 📁 هيكل المشروع

```
doctor-booking/
├── client/                 # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── components/     # المكونات
│   │   ├── pages/         # الصفحات
│   │   ├── contexts/      # السياق
│   │   └── styles/        # الأنماط
│   └── package.json
├── server/                # الخادم (Node.js)
│   ├── routes/           # المسارات
│   ├── models/           # النماذج
│   ├── utils/            # الأدوات
│   └── package.json
├── start-all.bat         # تشغيل سريع (Windows)
├── start-all.ps1         # تشغيل سريع (PowerShell)
├── docker-compose.yml    # Docker Compose
└── README.md
```

## 🔧 التطوير

### إضافة ميزات جديدة:
1. أضف المكونات في `client/src/components/`
2. أضف الصفحات في `client/src/pages/`
3. أضف المسارات في `server/routes/`
4. أضف النماذج في `server/models/`

### اختبار التطبيق:
```bash
# اختبار العميل
cd client
npm test

# اختبار الخادم
cd server
npm test
```

## 📊 البيانات التجريبية

المشروع يحتوي على بيانات تجريبية للاختبار:
- **16 سبتمبر**: أحمد محمد، سارة أحمد
- **17 سبتمبر**: محمد علي، فاطمة حسن

## 🆘 الدعم

### المشاكل الشائعة:

1. **الخادم لا يعمل**:
   - تأكد من تثبيت Node.js
   - تحقق من المنفذ 5000

2. **العميل لا يعمل**:
   - تأكد من تثبيت npm
   - تحقق من المنفذ 3000

3. **البريد الإلكتروني لا يعمل**:
   - تحقق من إعدادات Gmail
   - استخدم App Password

### الحصول على المساعدة:
- تحقق من console في المتصفح
- راجع ملفات log في الخادم
- تأكد من إعدادات البيئة

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء branch جديد
3. إضافة الميزات
4. إرسال Pull Request

---

**تم تطوير هذا المشروع بـ ❤️ لخدمة المجتمع الطبي**
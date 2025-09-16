# 🏥 نظام حجز مواعيد الدكتور

![GitHub stars](https://img.shields.io/github/stars/your-username/doctor-booking-system)
![GitHub forks](https://img.shields.io/github/forks/your-username/doctor-booking-system)
![GitHub issues](https://img.shields.io/github/issues/your-username/doctor-booking-system)
![GitHub license](https://img.shields.io/github/license/your-username/doctor-booking-system)

## 📋 نظرة عامة

نظام شامل لإدارة حجوزات المواعيد الطبية مع واجهة إدارية متقدمة. تم تطويره باستخدام React و Node.js.

## ✨ المميزات

### 👥 للمرضى
- 📅 حجز مواعيد جديدة
- 🔍 عرض المواعيد المتاحة
- 📝 إدخال البيانات الشخصية
- ⏰ اختيار التاريخ والوقت المناسب

### 👨‍💼 للإدارة
- 📊 لوحة تحكم شاملة
- 🔍 فلترة متقدمة (التاريخ، الحالة، البحث)
- 📈 إحصائيات مفصلة
- 📧 إرسال التقارير بالبريد الإلكتروني
- 📄 تصدير التقارير (CSV)
- ⚙️ إدارة الحجوزات

### 👨‍⚕️ للدكتور
- 🔐 تسجيل دخول آمن
- 📋 عرض الحجوزات
- ✅ تحديث حالة الحجوزات

## 🚀 التشغيل السريع

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت
```bash
# استنساخ المشروع
git clone https://github.com/your-username/doctor-booking-system.git
cd doctor-booking-system

# تثبيت dependencies للخادم
cd server
npm install

# تثبيت dependencies للعميل
cd ../client
npm install
```

### التشغيل
```bash
# تشغيل الخادم
cd server
npm start

# تشغيل العميل (في terminal جديد)
cd client
npm start
```

## 🌐 النشر

### النشر المجاني
- **العميل**: [Vercel](https://vercel.com)
- **الخادم**: [Railway](https://railway.app)

### النشر الاحترافي
- **Docker**: `docker-compose up -d`
- **Kubernetes**: متوفر في مجلد `k8s/`

## 🛠️ التقنيات المستخدمة

### Frontend
- React 18
- React Router
- Styled Components
- Axios
- React Toastify
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- JWT
- Nodemailer
- Moment.js

## 📁 هيكل المشروع

```
doctor-booking-system/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # المكونات
│   │   ├── pages/         # الصفحات
│   │   ├── contexts/      # السياق
│   │   └── styles/        # الأنماط
│   └── package.json
├── server/                # Node.js Backend
│   ├── routes/           # المسارات
│   ├── models/           # النماذج
│   ├── utils/            # الأدوات
│   └── package.json
├── docs/                 # الوثائق
├── docker-compose.yml    # Docker Compose
└── README.md
```

## 🔧 التطوير

### إضافة ميزات جديدة
1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الـ branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

### الاختبار
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

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) أولاً.

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## 👥 المساهمون

- [اسمك](https://github.com/your-username) - المطور الرئيسي

## 📞 الدعم

- 📧 البريد الإلكتروني: your-email@example.com
- 🐛 الإبلاغ عن مشاكل: [Issues](https://github.com/your-username/doctor-booking-system/issues)
- 💬 المناقشات: [Discussions](https://github.com/your-username/doctor-booking-system/discussions)

## 🙏 شكر وتقدير

- [React](https://reactjs.org/) - مكتبة واجهة المستخدم
- [Node.js](https://nodejs.org/) - بيئة تشغيل JavaScript
- [MongoDB](https://www.mongodb.com/) - قاعدة البيانات
- [Vercel](https://vercel.com/) - استضافة الواجهة الأمامية
- [Railway](https://railway.app/) - استضافة الخادم

---

**تم تطوير هذا المشروع بـ ❤️ لخدمة المجتمع الطبي**

⭐ إذا أعجبك المشروع، لا تنس إعطاؤه نجمة!


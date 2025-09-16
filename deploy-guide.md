# دليل نشر موقع حجز مواعيد الدكتور

## 🚀 الطريقة الأولى: النشر المجاني (الأسهل)

### 1. نشر العميل (الواجهة الأمامية) على Vercel:

#### الخطوات:
1. اذهب إلى https://vercel.com
2. سجل حساب جديد (مجاني)
3. اضغط "New Project"
4. ارفع مجلد `client` كامل
5. Vercel سيكتشف تلقائياً أنه React app
6. اضغط "Deploy"

#### النتيجة:
- ستحصل على رابط مثل: `https://your-app.vercel.app`
- الموقع سيعمل تلقائياً

### 2. نشر الخادم (Backend) على Railway:

#### الخطوات:
1. اذهب إلى https://railway.app
2. سجل حساب جديد (مجاني)
3. اضغط "New Project" → "Deploy from GitHub repo"
4. ارفع مجلد `server` كامل
5. Railway سيكتشف تلقائياً أنه Node.js app
6. اضغط "Deploy"

#### النتيجة:
- ستحصل على رابط مثل: `https://your-app.railway.app`
- API سيعمل تلقائياً

### 3. ربط العميل بالخادم:

#### في مجلد client، عدل ملف package.json:
```json
{
  "proxy": "https://your-app.railway.app"
}
```

#### أو أضف متغير البيئة في Vercel:
```
REACT_APP_API_URL=https://your-app.railway.app
```

---

## 🏢 الطريقة الثانية: النشر الاحترافي

### 1. استخدام MongoDB Atlas (قاعدة بيانات حقيقية):

#### الخطوات:
1. اذهب إلى https://cloud.mongodb.com
2. سجل حساب جديد (مجاني)
3. أنشئ cluster جديد
4. احصل على رابط الاتصال
5. ضع الرابط في ملف `server/config.env`

### 2. استخدام الخادم الكامل:

#### بدلاً من simple-server.js، استخدم:
```bash
cd server
npm install
node index.js
```

### 3. إعداد البريد الإلكتروني:

#### في ملف server/config.env:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
DEFAULT_DOCTOR_EMAIL=doctor@example.com
```

---

## 📋 قائمة التحقق قبل النشر:

### ✅ للعميل:
- [ ] جميع الملفات موجودة في مجلد client
- [ ] package.json يحتوي على جميع dependencies
- [ ] لا توجد أخطاء في الكود
- [ ] تم اختبار جميع الصفحات

### ✅ للخادم:
- [ ] جميع الملفات موجودة في مجلد server
- [ ] package.json يحتوي على جميع dependencies
- [ ] ملف config.env مُعد بشكل صحيح
- [ ] تم اختبار جميع API endpoints

### ✅ للقاعدة البيانات:
- [ ] MongoDB Atlas cluster جاهز
- [ ] رابط الاتصال صحيح
- [ ] تم اختبار الاتصال

---

## 🔧 نصائح مهمة:

1. **ابدأ بالطريقة الأولى** (المجانية) للاختبار
2. **استخدم MongoDB Atlas** بدلاً من قاعدة بيانات محلية
3. **اختبر كل شيء** قبل النشر النهائي
4. **احتفظ بنسخة احتياطية** من الكود
5. **راقب الأداء** بعد النشر

---

## 📞 الدعم:

إذا واجهت أي مشاكل:
1. تحقق من console في المتصفح
2. تحقق من logs في Vercel/Railway
3. تأكد من أن جميع المتغيرات مُعدة بشكل صحيح

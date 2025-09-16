# النشر السريع - نظام حجز مواعيد الدكتور

## ⚡ **خطوات سريعة (15 دقيقة)**

### 1️⃣ **إعداد MongoDB Atlas (5 دقائق)**
```
1. اذهب إلى: https://www.mongodb.com/atlas
2. أنشئ حساب مجاني
3. أنشئ cluster جديد (Free tier)
4. أضف IP Address: 0.0.0.0/0
5. أنشئ Database User
6. انسخ Connection String
```

### 2️⃣ **رفع الكود على GitHub (3 دقائق)**
```bash
git init
git add .
git commit -m "Doctor booking system"
git remote add origin https://github.com/username/doctor-booking.git
git push -u origin main
```

### 3️⃣ **نشر الخادم الخلفي على Railway (5 دقائق)**
```
1. اذهب إلى: https://railway.app
2. سجل دخول بـ GitHub
3. New Project → Deploy from GitHub
4. اختر repository
5. Root Directory: server
6. أضف Environment Variables:
   - MONGODB_URI: (من MongoDB Atlas)
   - JWT_SECRET: any-secret-key
   - NODE_ENV: production
```

### 4️⃣ **نشر الواجهة الأمامية على Vercel (2 دقيقة)**
```
1. اذهب إلى: https://vercel.com
2. سجل دخول بـ GitHub
3. New Project
4. اختر repository
5. Root Directory: client
6. أضف Environment Variable:
   - BACKEND_URL: (رابط Railway)
```

## 🎉 **انتهيت!**

الآن لديك نظام يعمل على الإنترنت:
- **الواجهة:** https://your-app.vercel.app
- **الخادم:** https://your-app.railway.app

## 🔧 **إذا واجهت مشاكل:**

### مشكلة MongoDB:
- تأكد من إضافة IP address
- تأكد من صحة connection string

### مشكلة Railway:
- تأكد من إضافة Environment Variables
- تأكد من أن Root Directory = server

### مشكلة Vercel:
- تأكد من إضافة BACKEND_URL
- تأكد من أن Root Directory = client

## 📱 **اختبار النظام:**
1. اذهب إلى رابط Vercel
2. جرب حجز موعد جديد
3. تحقق من أن البيانات تُحفظ

---

**💡 نصيحة:** ابدأ بـ MongoDB Atlas أولاً، ثم Railway، ثم Vercel

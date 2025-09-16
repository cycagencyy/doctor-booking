# دليل النشر - نظام حجز مواعيد الدكتور

## 🗄️ **1. إعداد قاعدة البيانات (MongoDB Atlas)**

### الخطوات:
1. **اذهب إلى:** https://www.mongodb.com/atlas
2. **أنشئ حساب مجاني**
3. **أنشئ cluster جديد:**
   - اختر "Free" tier
   - اختر أقرب منطقة جغرافية
   - اختر اسم للـ cluster
4. **أنشئ مستخدم قاعدة البيانات:**
   - اذهب إلى "Database Access"
   - اضغط "Add New Database User"
   - اختر "Password" واكتب كلمة مرور قوية
   - امنح صلاحيات "Read and write to any database"
5. **أضف IP Address:**
   - اذهب إلى "Network Access"
   - اضغط "Add IP Address"
   - اختر "Allow access from anywhere" (0.0.0.0/0)
6. **احصل على Connection String:**
   - اذهب إلى "Clusters"
   - اضغط "Connect"
   - اختر "Connect your application"
   - انسخ الـ connection string

### تحديث ملف الإعدادات:
```bash
# عدّل server/config.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-booking?retryWrites=true&w=majority
```

## 🚀 **2. النشر على Vercel (الواجهة الأمامية)**

### الخطوات:
1. **ارفع الكود على GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/doctor-booking.git
   git push -u origin main
   ```

2. **اذهب إلى:** https://vercel.com
3. **سجل دخول بحساب GitHub**
4. **اضغط "New Project"**
5. **اختر repository الخاص بك**
6. **اضبط الإعدادات:**
   - **Framework Preset:** Create React App
   - **Root Directory:** client
   - **Build Command:** npm run build
   - **Output Directory:** build
7. **أضف Environment Variables:**
   - `BACKEND_URL`: رابط الخادم الخلفي (سيأتي من Railway)

## 🚂 **3. النشر على Railway (الخادم الخلفي)**

### الخطوات:
1. **اذهب إلى:** https://railway.app
2. **سجل دخول بحساب GitHub**
3. **اضغط "New Project"**
4. **اختر "Deploy from GitHub repo"**
5. **اختر repository الخاص بك**
6. **اضبط الإعدادات:**
   - **Root Directory:** server
   - **Build Command:** npm install
   - **Start Command:** npm start
7. **أضف Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-booking?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   DEFAULT_DOCTOR_EMAIL=doctor@example.com
   DEFAULT_DOCTOR_PASSWORD=123456
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

## 🔗 **4. ربط الخادمين**

### بعد نشر الخادم الخلفي على Railway:
1. **انسخ رابط الخادم الخلفي** من Railway
2. **اذهب إلى Vercel**
3. **أضف Environment Variable:**
   - `BACKEND_URL`: رابط الخادم الخلفي من Railway

## 🧪 **5. اختبار النظام**

### اختبار الواجهة الأمامية:
- اذهب إلى رابط Vercel
- جرب حجز موعد جديد
- تحقق من أن البيانات تُحفظ

### اختبار الخادم الخلفي:
- اذهب إلى `https://your-railway-app.railway.app/api/health`
- يجب أن ترى: `{"ok": true, "message": "Server is running"}`

## 🔧 **6. إعداد البريد الإلكتروني (اختياري)**

### Gmail:
1. **فعّل 2-Factor Authentication**
2. **أنشئ App Password:**
   - اذهب إلى Google Account Settings
   - Security → 2-Step Verification → App passwords
   - اختر "Mail" و "Other"
   - انسخ كلمة المرور
3. **أضف في Environment Variables:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## 📱 **7. النطاقات المخصصة (اختياري)**

### Vercel:
- اذهب إلى Project Settings → Domains
- أضف نطاقك المخصص

### Railway:
- اذهب إلى Project Settings → Domains
- أضف نطاقك المخصص

## 🆘 **8. حل المشاكل الشائعة**

### مشكلة CORS:
- تأكد من إضافة `BACKEND_URL` في Vercel
- تأكد من أن الخادم الخلفي يعمل

### مشكلة قاعدة البيانات:
- تأكد من صحة connection string
- تأكد من إضافة IP address في MongoDB Atlas

### مشكلة البريد الإلكتروني:
- تأكد من استخدام App Password وليس كلمة المرور العادية
- تأكد من تفعيل 2FA

## 📊 **9. مراقبة النظام**

### Vercel:
- اذهب إلى Analytics لمراقبة الأداء
- اذهب إلى Functions لمراقبة API calls

### Railway:
- اذهب إلى Metrics لمراقبة الأداء
- اذهب إلى Logs لمراقبة الأخطاء

## 💰 **10. التكاليف**

### المجاني:
- **Vercel:** 100GB bandwidth/month
- **Railway:** $5 credit/month
- **MongoDB Atlas:** 512MB storage

### المدفوع (إذا احتجت):
- **Vercel Pro:** $20/month
- **Railway:** $5/month
- **MongoDB Atlas:** $9/month

---

## 🎉 **تهانينا!**

بعد اتباع هذه الخطوات، سيكون لديك نظام حجز مواعيد دكتور يعمل على الإنترنت بالكامل!

### الروابط النهائية:
- **الواجهة الأمامية:** https://your-app.vercel.app
- **الخادم الخلفي:** https://your-app.railway.app
- **قاعدة البيانات:** MongoDB Atlas
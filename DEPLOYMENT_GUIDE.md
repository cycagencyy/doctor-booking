# دليل رفع الموقع على الاستضافة والدومين

## 🌐 خيارات الاستضافة

### 1. الاستضافة المجانية
- **Vercel** (ممتاز لـ React)
- **Netlify** (سهل الاستخدام)
- **GitHub Pages** (مجاني)
- **Firebase Hosting** (Google)

### 2. الاستضافة المدفوعة
- **DigitalOcean** ($5/شهر)
- **AWS** (مرن ومتقدم)
- **Google Cloud** (موثوق)
- **Heroku** (سهل النشر)

## 🚀 رفع الموقع على Vercel (مجاني)

### الخطوة 1: إعداد المشروع
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# رفع المشروع
vercel
```

### الخطوة 2: إعداد متغيرات البيئة
```bash
# في Vercel Dashboard
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-booking
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### الخطوة 3: رفع قاعدة البيانات
```bash
# استخدام MongoDB Atlas (مجاني)
# 1. إنشاء حساب على mongodb.com
# 2. إنشاء cluster جديد
# 3. الحصول على connection string
# 4. تحديث MONGODB_URI
```

## 🏗️ إعداد المشروع للإنتاج

### 1. تحسين package.json
```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

### 2. إعداد Docker (اختياري)
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### 3. إعداد Nginx (للخوادم الخاصة)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

## 🔧 إعدادات الإنتاج

### 1. متغيرات البيئة للإنتاج
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. تحسين الأمان
```javascript
// server/index.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## 📱 إعداد PWA (Progressive Web App)

### 1. إضافة Service Worker
```javascript
// client/public/sw.js
const CACHE_NAME = 'doctor-booking-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### 2. إضافة Web App Manifest
```json
{
  "name": "نظام حجز مواعيد الدكتور",
  "short_name": "عيادة الدكتور",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🌍 شراء الدومين

### 1. مزودي الدومين
- **Namecheap** ($8.88/سنة)
- **GoDaddy** ($12.99/سنة)
- **Cloudflare** ($9.15/سنة)
- **Google Domains** ($12/سنة)

### 2. أسماء دومين مقترحة
- `doctor-booking.com`
- `clinic-appointment.com`
- `medical-booking.net`
- `doctor-schedule.org`

### 3. ربط الدومين بالاستضافة
```bash
# في Vercel
# 1. اذهب إلى Project Settings
# 2. اضغط على Domains
# 3. أضف دومينك
# 4. اتبع التعليمات لربط DNS
```

## 📊 مراقبة الأداء

### 1. Google Analytics
```javascript
// client/src/index.js
import ReactGA from 'react-ga';

ReactGA.initialize('GA_TRACKING_ID');
ReactGA.pageview(window.location.pathname);
```

### 2. Error Tracking
```javascript
// server/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN'
});
```

## 🔒 الأمان

### 1. HTTPS
```javascript
// إجبار HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 2. CORS
```javascript
// server/index.js
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

## 💰 التكلفة الإجمالية

### شهرياً:
- **الاستضافة**: $0-20
- **الدومين**: $1-2
- **قاعدة البيانات**: $0-25
- **الخدمات الخارجية**: $5-50

### سنوياً:
- **الدومين**: $10-25
- **SSL Certificate**: $0-100
- **الاستضافة**: $0-240

## 🎯 نصائح مهمة

1. **ابدأ بالمجاني** (Vercel + MongoDB Atlas)
2. **استخدم CDN** لتحسين السرعة
3. **فعل النسخ الاحتياطي** التلقائي
4. **راقب الأداء** باستمرار
5. **حدث النظام** بانتظام
6. **احم البيانات** بطبقات أمان متعددة

## 📞 الدعم الفني

- **Vercel Support**: support@vercel.com
- **MongoDB Support**: support@mongodb.com
- **GitHub Issues**: للمشاكل التقنية


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor-booking')
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => {
  console.error('خطأ في الاتصال بقاعدة البيانات:', err);
  console.log('تأكد من تشغيل MongoDB أو استخدم MongoDB Atlas');
});

// Routes
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/admin', require('./routes/admin'));

// Route للصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({ 
    message: 'مرحباً بك في نظام حجز مواعيد الدكتور',
    version: '1.0.0',
    status: 'active'
  });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : 'خطأ داخلي'
  });
});

// معالج المسارات غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار المطلوب غير موجود'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`البيئة: ${process.env.NODE_ENV || 'development'}`);
});

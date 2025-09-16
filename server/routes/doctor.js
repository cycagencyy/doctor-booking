const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const router = express.Router();

// إنشاء دكتور جديد (للمرة الأولى فقط)
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('اسم الدكتور يجب أن يكون على الأقل حرفين'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
  body('phone').trim().isLength({ min: 10 }).withMessage('رقم الهاتف غير صحيح'),
  body('specialization').trim().isLength({ min: 2 }).withMessage('التخصص مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, specialization, workingHours, workingDays } = req.body;

    // التحقق من وجود دكتور بالفعل
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'الدكتور مسجل بالفعل'
      });
    }

    const doctor = new Doctor({
      name,
      email,
      password,
      phone,
      specialization,
      workingHours: workingHours || { start: '09:00', end: '18:00' },
      workingDays: workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    });

    await doctor.save();

    // إنشاء رمز المصادقة
    const token = jwt.sign(
      { doctorId: doctor._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب الدكتور بنجاح',
      data: {
        doctor: doctor.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء حساب الدكتور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء حساب الدكتور',
      error: error.message
    });
  }
});

// تسجيل دخول الدكتور
router.post('/login', [
  body('email').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // البحث عن الدكتور
    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'بيانات تسجيل الدخول غير صحيحة'
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await doctor.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'بيانات تسجيل الدخول غير صحيحة'
      });
    }

    // التحقق من حالة الحساب
    if (!doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب غير نشط'
      });
    }

    // إنشاء رمز المصادقة
    const token = jwt.sign(
      { doctorId: doctor._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        doctor: doctor.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تسجيل الدخول',
      error: error.message
    });
  }
});

// Middleware للتحقق من مصادقة الدكتور
const authenticateDoctor = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'رمز المصادقة مطلوب'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const doctor = await Doctor.findById(decoded.doctorId);
    
    if (!doctor || !doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'رمز المصادقة غير صحيح'
      });
    }

    req.doctor = doctor;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'رمز المصادقة غير صحيح'
    });
  }
};

// الحصول على معلومات الدكتور
router.get('/profile', authenticateDoctor, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.doctor
    });
  } catch (error) {
    console.error('خطأ في جلب معلومات الدكتور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب معلومات الدكتور',
      error: error.message
    });
  }
});

// تحديث معلومات الدكتور
router.put('/profile', authenticateDoctor, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('اسم الدكتور يجب أن يكون على الأقل حرفين'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('رقم الهاتف غير صحيح'),
  body('specialization').optional().trim().isLength({ min: 2 }).withMessage('التخصص مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { name, phone, specialization, workingHours, workingDays } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (specialization) updateData.specialization = specialization;
    if (workingHours) updateData.workingHours = workingHours;
    if (workingDays) updateData.workingDays = workingDays;

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctor._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'تم تحديث معلومات الدكتور بنجاح',
      data: doctor
    });

  } catch (error) {
    console.error('خطأ في تحديث معلومات الدكتور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث معلومات الدكتور',
      error: error.message
    });
  }
});

// تغيير كلمة المرور
router.put('/change-password', authenticateDoctor, [
  body('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword').isLength({ min: 6 }).withMessage('كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // جلب الدكتور مع كلمة المرور
    const doctor = await Doctor.findById(req.doctor._id).select('+password');
    
    // التحقق من كلمة المرور الحالية
    const isCurrentPasswordValid = await doctor.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // تحديث كلمة المرور
    doctor.password = newPassword;
    await doctor.save();

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });

  } catch (error) {
    console.error('خطأ في تغيير كلمة المرور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تغيير كلمة المرور',
      error: error.message
    });
  }
});

// الحصول على حجوزات الدكتور
router.get('/appointments', authenticateDoctor, async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (date) query.appointmentDate = new Date(date);

    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('خطأ في جلب حجوزات الدكتور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب حجوزات الدكتور',
      error: error.message
    });
  }
});

// إنشاء دكتور افتراضي (للتطوير)
router.post('/create-default', async (req, res) => {
  try {
    // التحقق من وجود دكتور بالفعل
    const existingDoctor = await Doctor.findOne();
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'الدكتور موجود بالفعل'
      });
    }

    const doctor = new Doctor({
      name: 'د. أحمد محمد',
      email: process.env.DEFAULT_DOCTOR_EMAIL || 'doctor@example.com',
      password: process.env.DEFAULT_DOCTOR_PASSWORD || '123456',
      phone: '01234567890',
      specialization: 'طب عام',
      workingHours: { start: '09:00', end: '18:00' },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الدكتور الافتراضي بنجاح',
      data: {
        email: doctor.email,
        password: process.env.DEFAULT_DOCTOR_PASSWORD || '123456'
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء الدكتور الافتراضي:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء الدكتور الافتراضي',
      error: error.message
    });
  }
});

module.exports = router;


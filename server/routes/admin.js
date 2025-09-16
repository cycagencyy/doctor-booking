const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendAppointmentEmail, sendDailyAppointmentsEmail } = require('../utils/emailService');
const moment = require('moment');

const router = express.Router();

// Middleware للتحقق من صلاحيات الإدارة (يمكن تطويره لاحقاً)
const adminAuth = (req, res, next) => {
  // هنا يمكن إضافة نظام مصادقة للإدارة
  next();
};

// الحصول على إحصائيات الحجوزات
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');

    const stats = await Promise.all([
      // إجمالي الحجوزات
      Appointment.countDocuments(),
      
      // حجوزات اليوم
      Appointment.countDocuments({
        appointmentDate: { $gte: today.toDate() }
      }),
      
      // حجوزات هذا الأسبوع
      Appointment.countDocuments({
        appointmentDate: { $gte: thisWeek.toDate() }
      }),
      
      // حجوزات هذا الشهر
      Appointment.countDocuments({
        appointmentDate: { $gte: thisMonth.toDate() }
      }),
      
      // الحجوزات المؤكدة
      Appointment.countDocuments({ status: 'confirmed' }),
      
      // الحجوزات المعلقة
      Appointment.countDocuments({ status: 'pending' }),
      
      // الحجوزات الملغية
      Appointment.countDocuments({ status: 'cancelled' })
    ]);

    const [total, todayCount, weekCount, monthCount, confirmed, pending, cancelled] = stats;

    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
        pending,
        confirmed,
        cancelled,
        revenue: total * 150, // تقدير الإيرادات
        rating: 4.8,
        growth: 12
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الإحصائيات',
      error: error.message
    });
  }
});

// الحصول على حجوزات اليوم
router.get('/today', adminAuth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');

    const appointments = await Appointment.find({
      appointmentDate: { $gte: today.toDate(), $lt: tomorrow.toDate() }
    }).sort({ appointmentTime: 1 });

    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error('خطأ في جلب حجوزات اليوم:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب حجوزات اليوم',
      error: error.message
    });
  }
});

// الحصول على جميع الحجوزات مع إمكانيات البحث والتصفية
router.get('/appointments', adminAuth, async (req, res) => {
  try {
    const { 
      status, 
      date, 
      patientName, 
      page = 1, 
      limit = 20,
      sortBy = 'appointmentDate',
      sortOrder = 'asc'
    } = req.query;

    let query = {};
    
    // بناء استعلام البحث
    if (status) query.status = status;
    if (date) {
      // استخدام moment لضمان التعامل الصحيح مع التواريخ
      const startDate = moment(date).startOf('day').toDate();
      const endDate = moment(date).endOf('day').toDate();
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }
    if (patientName) {
      query.patientName = { $regex: patientName, $options: 'i' };
    }

    // بناء ترتيب النتائج
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const appointments = await Appointment.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الحجوزات:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الحجوزات',
      error: error.message
    });
  }
});

// تحديث حالة الحجز
router.patch('/appointments/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('حالة غير صحيحة'),
  body('doctorNotes').optional().isLength({ max: 1000 }).withMessage('ملاحظات الدكتور طويلة جداً')
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

    const { status, doctorNotes } = req.body;
    const updateData = { status, updatedAt: Date.now() };
    
    if (doctorNotes) {
      updateData.doctorNotes = doctorNotes;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    // إرسال إشعار بالبريد الإلكتروني
    try {
      await sendAppointmentEmail(appointment, status);
    } catch (emailError) {
      console.error('خطأ في إرسال البريد الإلكتروني:', emailError);
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة الحجز بنجاح',
      data: appointment
    });

  } catch (error) {
    console.error('خطأ في تحديث الحجز:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث الحجز',
      error: error.message
    });
  }
});

// حذف حجز
router.delete('/appointments/:id', adminAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف الحجز:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف الحجز',
      error: error.message
    });
  }
});

// إرسال تقرير الحجوزات اليومية
router.post('/send-daily-report', adminAuth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');

    const appointments = await Appointment.find({
      appointmentDate: { $gte: today.toDate(), $lt: tomorrow.toDate() }
    }).sort({ appointmentTime: 1 });

    // التحقق من وجود إعدادات البريد الإلكتروني
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.DEFAULT_DOCTOR_EMAIL) {
      return res.status(400).json({
        success: false,
        message: 'إعدادات البريد الإلكتروني غير مكتملة. يرجى إضافة EMAIL_USER, EMAIL_PASS, و DEFAULT_DOCTOR_EMAIL في ملف config.env'
      });
    }

    await sendDailyAppointmentsEmail(appointments);

    res.json({
      success: true,
      message: 'تم إرسال التقرير اليومي بنجاح',
      data: {
        appointmentsCount: appointments.length,
        sentTo: process.env.DEFAULT_DOCTOR_EMAIL
      }
    });

  } catch (error) {
    console.error('خطأ في إرسال التقرير اليومي:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال التقرير اليومي',
      error: error.message
    });
  }
});

// الحصول على تقرير الحجوزات لفترة معينة
router.get('/report', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, status, format = 'json' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'تاريخ البداية والنهاية مطلوبان'
      });
    }

    let query = {
      appointmentDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    // تجميع البيانات للإحصائيات
    const stats = {
      total: appointments.length,
      byStatus: {},
      byDate: {}
    };

    appointments.forEach(appointment => {
      // إحصائيات حسب الحالة
      stats.byStatus[appointment.status] = (stats.byStatus[appointment.status] || 0) + 1;
      
      // إحصائيات حسب التاريخ
      const date = moment(appointment.appointmentDate).format('YYYY-MM-DD');
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });

    // تصدير CSV
    if (format === 'csv') {
      const csvHeader = 'اسم المريض,البريد الإلكتروني,رقم الهاتف,التاريخ,الوقت,الحالة,ملاحظات\n';
      const csvData = appointments.map(appointment => 
        `"${appointment.patientName}","${appointment.patientEmail}","${appointment.patientPhone}","${moment(appointment.appointmentDate).format('YYYY-MM-DD')}","${appointment.appointmentTime}","${appointment.status}","${appointment.notes || ''}"`
      ).join('\n');
      
      const csv = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="appointments-report-${startDate}-to-${endDate}.csv"`);
      return res.send('\ufeff' + csv); // BOM for UTF-8
    }

    res.json({
      success: true,
      data: {
        appointments,
        stats,
        period: {
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    console.error('خطأ في جلب التقرير:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب التقرير',
      error: error.message
    });
  }
});

module.exports = router;

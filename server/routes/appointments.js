const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendAppointmentEmail } = require('../utils/emailService');
const moment = require('moment');

const router = express.Router();

// التحقق من صحة البيانات
const appointmentValidation = [
  body('patientName').trim().isLength({ min: 2 }).withMessage('اسم المريض يجب أن يكون على الأقل حرفين'),
  body('patientEmail').isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('patientPhone').trim().isLength({ min: 10 }).withMessage('رقم الهاتف غير صحيح'),
  body('appointmentDate').isISO8601().withMessage('تاريخ الموعد غير صحيح'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('وقت الموعد غير صحيح')
];

// إنشاء حجز جديد
router.post('/', appointmentValidation, async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errors.array()
      });
    }

    const { patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, notes } = req.body;

    // التحقق من أن التاريخ في المستقبل
    const appointmentDateTime = moment(`${appointmentDate} ${appointmentTime}`);
    if (appointmentDateTime.isBefore(moment())) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن حجز موعد في الماضي'
      });
    }

    // التحقق من توفر الموعد
    const isAvailable = await Appointment.isTimeSlotAvailable(appointmentDate, appointmentTime);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'هذا الموعد محجوز بالفعل، يرجى اختيار موعد آخر'
      });
    }

    // إنشاء الحجز
    const appointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      notes
    });

    await appointment.save();

    // إرسال إشعار بالبريد الإلكتروني
    try {
      await sendAppointmentEmail(appointment, 'new');
    } catch (emailError) {
      console.error('خطأ في إرسال البريد الإلكتروني:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      data: appointment
    });

  } catch (error) {
    console.error('خطأ في إنشاء الحجز:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء الحجز',
      error: error.message
    });
  }
});

// الحصول على جميع الحجوزات
router.get('/', async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (date) {
      // استخدام moment لضمان التعامل الصحيح مع التواريخ
      const startDate = moment(date).startOf('day').toDate();
      const endDate = moment(date).endOf('day').toDate();
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

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
    console.error('خطأ في جلب الحجوزات:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الحجوزات',
      error: error.message
    });
  }
});

// الحصول على حجز محدد
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('خطأ في جلب الحجز:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الحجز',
      error: error.message
    });
  }
});

// تحديث حالة الحجز
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
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

// الحصول على المواعيد المتاحة
router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // التحقق من صحة التاريخ
    if (!moment(date).isValid()) {
      return res.status(400).json({
        success: false,
        message: 'تاريخ غير صحيح'
      });
    }

    // الحصول على جميع المواعيد المحجوزة في هذا اليوم
    const bookedAppointments = await Appointment.find({
      appointmentDate: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('appointmentTime');

    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);
    
    // الحصول على جميع المواعيد المتاحة
    const allTimeSlots = Appointment.getAvailableTimeSlots();
    const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));

    res.json({
      success: true,
      data: {
        date,
        availableSlots,
        bookedSlots: bookedTimes
      }
    });

  } catch (error) {
    console.error('خطأ في جلب المواعيد المتاحة:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب المواعيد المتاحة',
      error: error.message
    });
  }
});

// حذف حجز
router.delete('/:id', async (req, res) => {
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

module.exports = router;

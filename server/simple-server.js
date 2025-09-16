const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// بيانات وهمية للحجوزات
let appointments = [
  {
    _id: '1',
    patientName: 'أحمد محمد',
    patientEmail: 'ahmed@example.com',
    patientPhone: '01234567890',
    appointmentDate: '2025-09-16',
    appointmentTime: '10:00',
    status: 'confirmed',
    notes: 'موعد تجريبي'
  },
  {
    _id: '2',
    patientName: 'سارة أحمد',
    patientEmail: 'sara@example.com',
    patientPhone: '01234567891',
    appointmentDate: '2025-09-16',
    appointmentTime: '09:00',
    status: 'confirmed',
    notes: 'فحص دوري'
  },
  {
    _id: '3',
    patientName: 'محمد علي',
    patientEmail: 'mohamed@example.com',
    patientPhone: '01234567892',
    appointmentDate: '2025-09-17',
    appointmentTime: '11:00',
    status: 'pending',
    notes: 'استشارة طبية'
  },
  {
    _id: '4',
    patientName: 'فاطمة حسن',
    patientEmail: 'fatima@example.com',
    patientPhone: '01234567893',
    appointmentDate: '2025-09-17',
    appointmentTime: '14:00',
    status: 'confirmed',
    notes: 'متابعة علاج'
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'مرحباً بك في نظام حجز مواعيد الدكتور',
    version: '1.0.0',
    status: 'active'
  });
});

// جلب جميع الحجوزات
app.get('/api/appointments', (req, res) => {
  res.json({
    success: true,
    data: appointments
  });
});

// إنشاء حجز جديد
app.post('/api/appointments', (req, res) => {
  const { patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, notes } = req.body;
  
  const newAppointment = {
    _id: Date.now().toString(),
    patientName,
    patientEmail,
    patientPhone,
    appointmentDate,
    appointmentTime,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date()
  };
  
  appointments.push(newAppointment);
  
  res.status(201).json({
    success: true,
    message: 'تم إنشاء الحجز بنجاح',
    data: newAppointment
  });
});

// جلب المواعيد المتاحة
app.get('/api/appointments/available/:date', (req, res) => {
  const { date } = req.params;
  
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  
  // المواعيد المحجوزة في هذا التاريخ
  const bookedTimes = appointments
    .filter(apt => apt.appointmentDate === date && apt.status !== 'cancelled')
    .map(apt => apt.appointmentTime);
  
  const availableSlots = timeSlots.filter(time => !bookedTimes.includes(time));
  
  res.json({
    success: true,
    data: {
      date,
      availableSlots,
      bookedSlots: bookedTimes
    }
  });
});

// تحديث حالة الحجز
app.patch('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appointment = appointments.find(apt => apt._id === id);
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'الحجز غير موجود'
    });
  }
  
  appointment.status = status;
  
  res.json({
    success: true,
    message: 'تم تحديث حالة الحجز بنجاح',
    data: appointment
  });
});

// تحديث حالة الحجز للإدارة
app.patch('/api/admin/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appointment = appointments.find(apt => apt._id === id);
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'الحجز غير موجود'
    });
  }
  
  appointment.status = status;
  
  res.json({
    success: true,
    message: 'تم تحديث حالة الحجز بنجاح',
    data: appointment
  });
});

// إحصائيات الإدارة
app.get('/api/admin/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    total: appointments.length,
    today: appointments.filter(apt => apt.appointmentDate === today).length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// حجوزات اليوم
app.get('/api/admin/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointmentDate === today);
  
  res.json({
    success: true,
    data: todayAppointments
  });
});

// جميع الحجوزات للإدارة مع الفلترة
app.get('/api/admin/appointments', (req, res) => {
  const { status, date, patientName } = req.query;
  
  let filteredAppointments = [...appointments];
  
  // فلترة حسب الحالة
  if (status) {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
  }
  
  // فلترة حسب التاريخ
  if (date) {
    filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date);
  }
  
  // فلترة حسب اسم المريض
  if (patientName) {
    filteredAppointments = filteredAppointments.filter(apt => 
      apt.patientName.toLowerCase().includes(patientName.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredAppointments,
    pagination: {
      current: 1,
      pages: 1,
      total: filteredAppointments.length
    }
  });
});

// تسجيل دخول الدكتور
app.post('/api/doctor/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'doctor@example.com' && password === '123456') {
    const doctor = {
      _id: '1',
      name: 'د. أحمد محمد',
      email: 'doctor@example.com',
      phone: '01234567890',
      specialization: 'طب عام'
    };
    
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        doctor,
        token: 'doctor-token-123'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'بيانات تسجيل الدخول غير صحيحة'
    });
  }
});

// إنشاء دكتور افتراضي
app.post('/api/doctor/create-default', (req, res) => {
  res.json({
    success: true,
    message: 'تم إنشاء الدكتور الافتراضي بنجاح',
    data: {
      email: 'doctor@example.com',
      password: '123456'
    }
  });
});

// إرسال تقرير الحجوزات اليومية
app.post('/api/admin/send-daily-report', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointmentDate === today);
  
  res.json({
    success: true,
    message: 'تم إرسال التقرير اليومي بنجاح',
    data: {
      appointmentsCount: todayAppointments.length,
      sentTo: 'doctor@example.com'
    }
  });
});

// الحصول على تقرير الحجوزات لفترة معينة
app.get('/api/admin/report', (req, res) => {
  const { startDate, endDate, status, format = 'json' } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'تاريخ البداية والنهاية مطلوبان'
    });
  }

  let filteredAppointments = appointments.filter(apt => {
    const aptDate = apt.appointmentDate;
    return aptDate >= startDate && aptDate <= endDate;
  });

  if (status) {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
  }

  // تجميع البيانات للإحصائيات
  const stats = {
    total: filteredAppointments.length,
    byStatus: {},
    byDate: {}
  };

  filteredAppointments.forEach(appointment => {
    // إحصائيات حسب الحالة
    stats.byStatus[appointment.status] = (stats.byStatus[appointment.status] || 0) + 1;
    
    // إحصائيات حسب التاريخ
    stats.byDate[appointment.appointmentDate] = (stats.byDate[appointment.appointmentDate] || 0) + 1;
  });

  // تصدير CSV
  if (format === 'csv') {
    const csvHeader = 'اسم المريض,البريد الإلكتروني,رقم الهاتف,التاريخ,الوقت,الحالة,ملاحظات\n';
    const csvData = filteredAppointments.map(appointment => 
      `"${appointment.patientName}","${appointment.patientEmail}","${appointment.patientPhone}","${appointment.appointmentDate}","${appointment.appointmentTime}","${appointment.status}","${appointment.notes || ''}"`
    ).join('\n');
    
    const csv = csvHeader + csvData;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="appointments-report-${startDate}-to-${endDate}.csv"`);
    return res.send('\ufeff' + csv); // BOM for UTF-8
  }

  res.json({
    success: true,
    data: {
      appointments: filteredAppointments,
      stats,
      period: {
        startDate,
        endDate
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`البيئة: ${process.env.NODE_ENV || 'development'}`);
  console.log('يمكنك الآن فتح http://localhost:3000 لرؤية الموقع');
});

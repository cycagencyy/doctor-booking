const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'اسم المريض مطلوب'],
    trim: true
  },
  patientEmail: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    trim: true,
    lowercase: true
  },
  patientPhone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'تاريخ الموعد مطلوب']
  },
  appointmentTime: {
    type: String,
    required: [true, 'وقت الموعد مطلوب']
  },
  duration: {
    type: Number,
    default: 30, // مدة الموعد بالدقائق
    min: 15,
    max: 120
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  doctorNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// تحديث updatedAt عند كل تعديل
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// فهرس لمنع التضارب في المواعيد
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 }, { unique: true });

// دالة للتحقق من توفر الموعد
appointmentSchema.statics.isTimeSlotAvailable = async function(date, time) {
  const existingAppointment = await this.findOne({
    appointmentDate: date,
    appointmentTime: time,
    status: { $in: ['pending', 'confirmed'] }
  });
  return !existingAppointment;
};

// دالة للحصول على المواعيد المتاحة في يوم معين
appointmentSchema.statics.getAvailableTimeSlots = function(date) {
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  return timeSlots;
};

module.exports = mongoose.model('Appointment', appointmentSchema);


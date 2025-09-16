const nodemailer = require('nodemailer');
const moment = require('moment');

// إعداد مرسل البريد الإلكتروني
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// قوالب البريد الإلكتروني
const emailTemplates = {
  new: {
    subject: 'تأكيد حجز موعد جديد - عيادة الدكتور',
    template: (appointment) => `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">تأكيد حجز موعد جديد</h2>
          <p style="color: #7f8c8d; font-size: 16px;">مرحباً ${appointment.patientName}</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">تفاصيل الموعد</h3>
          
          <div style="margin: 20px 0;">
            <p><strong>اسم المريض:</strong> ${appointment.patientName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${appointment.patientEmail}</p>
            <p><strong>رقم الهاتف:</strong> ${appointment.patientPhone}</p>
            <p><strong>تاريخ الموعد:</strong> ${moment(appointment.appointmentDate).format('YYYY-MM-DD')}</p>
            <p><strong>وقت الموعد:</strong> ${appointment.appointmentTime}</p>
            <p><strong>حالة الموعد:</strong> <span style="color: #f39c12;">في انتظار التأكيد</span></p>
          </div>
          
          ${appointment.notes ? `
            <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="color: #2c3e50; margin-top: 0;">ملاحظات:</h4>
              <p style="margin: 0;">${appointment.notes}</p>
            </div>
          ` : ''}
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #27ae60;"><strong>ملاحظة:</strong> سيتم تأكيد الموعد خلال 24 ساعة. يرجى الحضور قبل الموعد بـ 10 دقائق.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7f8c8d;">
          <p>شكراً لاختيارك عيادتنا</p>
          <p>للاستفسارات: ${process.env.EMAIL_FROM}</p>
        </div>
      </div>
    `
  },
  
  confirmed: {
    subject: 'تأكيد موعدك - عيادة الدكتور',
    template: (appointment) => `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #155724; margin-bottom: 20px;">✅ تم تأكيد موعدك</h2>
          <p style="color: #155724; font-size: 16px;">مرحباً ${appointment.patientName}</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; border-bottom: 2px solid #28a745; padding-bottom: 10px;">تفاصيل الموعد المؤكد</h3>
          
          <div style="margin: 20px 0;">
            <p><strong>اسم المريض:</strong> ${appointment.patientName}</p>
            <p><strong>تاريخ الموعد:</strong> ${moment(appointment.appointmentDate).format('YYYY-MM-DD')}</p>
            <p><strong>وقت الموعد:</strong> ${appointment.appointmentTime}</p>
            <p><strong>حالة الموعد:</strong> <span style="color: #28a745;">مؤكد</span></p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">تعليمات مهمة:</h4>
            <ul style="color: #856404; margin: 0;">
              <li>يرجى الحضور قبل الموعد بـ 10 دقائق</li>
              <li>إحضار الهوية الشخصية</li>
              <li>في حالة التأخير، يرجى الاتصال مسبقاً</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7f8c8d;">
          <p>نتطلع لرؤيتك في الموعد المحدد</p>
          <p>للاستفسارات: ${process.env.EMAIL_FROM}</p>
        </div>
      </div>
    `
  },
  
  cancelled: {
    subject: 'إلغاء موعد - عيادة الدكتور',
    template: (appointment) => `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #721c24; margin-bottom: 20px;">❌ تم إلغاء الموعد</h2>
          <p style="color: #721c24; font-size: 16px;">مرحباً ${appointment.patientName}</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">تفاصيل الموعد الملغي</h3>
          
          <div style="margin: 20px 0;">
            <p><strong>اسم المريض:</strong> ${appointment.patientName}</p>
            <p><strong>تاريخ الموعد:</strong> ${moment(appointment.appointmentDate).format('YYYY-MM-DD')}</p>
            <p><strong>وقت الموعد:</strong> ${appointment.appointmentTime}</p>
            <p><strong>حالة الموعد:</strong> <span style="color: #dc3545;">ملغي</span></p>
          </div>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #721c24;">تم إلغاء موعدك. يمكنك حجز موعد جديد في أي وقت مناسب لك.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #7f8c8d;">
          <p>نأسف للإزعاج</p>
          <p>للاستفسارات: ${process.env.EMAIL_FROM}</p>
        </div>
      </div>
    `
  }
};

// إرسال بريد إلكتروني للحجز
const sendAppointmentEmail = async (appointment, type) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('إعدادات البريد الإلكتروني غير مكتملة، سيتم تخطي الإرسال');
      return;
    }

    const transporter = createTransporter();
    const template = emailTemplates[type];
    
    if (!template) {
      throw new Error(`نوع البريد الإلكتروني غير مدعوم: ${type}`);
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: appointment.patientEmail,
      subject: template.subject,
      html: template.template(appointment)
    };

    // إرسال نسخة للدكتور أيضاً
    if (process.env.DEFAULT_DOCTOR_EMAIL) {
      const doctorMailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.DEFAULT_DOCTOR_EMAIL,
        subject: `إشعار جديد - ${template.subject}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>إشعار جديد من نظام الحجوزات</h2>
            <p>تم ${type === 'new' ? 'إنشاء' : type === 'confirmed' ? 'تأكيد' : 'إلغاء'} حجز جديد</p>
            ${template.template(appointment)}
          </div>
        `
      };
      
      await transporter.sendMail(doctorMailOptions);
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('تم إرسال البريد الإلكتروني بنجاح:', result.messageId);
    return result;

  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error);
    throw error;
  }
};

// إرسال بريد إلكتروني يومي للحجوزات
const sendDailyAppointmentsEmail = async (appointments) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.DEFAULT_DOCTOR_EMAIL) {
      return;
    }

    const transporter = createTransporter();
    const today = moment().format('YYYY-MM-DD');
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.DEFAULT_DOCTOR_EMAIL,
      subject: `حجوزات اليوم - ${today}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>حجوزات اليوم - ${today}</h2>
          <p>إجمالي الحجوزات: ${appointments.length}</p>
          
          ${appointments.map(appointment => `
            <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
              <h4>${appointment.patientName}</h4>
              <p><strong>الوقت:</strong> ${appointment.appointmentTime}</p>
              <p><strong>الهاتف:</strong> ${appointment.patientPhone}</p>
              <p><strong>الحالة:</strong> ${appointment.status}</p>
              ${appointment.notes ? `<p><strong>ملاحظات:</strong> ${appointment.notes}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('تم إرسال تقرير الحجوزات اليومية');

  } catch (error) {
    console.error('خطأ في إرسال تقرير الحجوزات اليومية:', error);
  }
};

module.exports = {
  sendAppointmentEmail,
  sendDailyAppointmentsEmail
};

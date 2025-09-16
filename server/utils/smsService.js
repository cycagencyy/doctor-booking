const axios = require('axios');

// خدمة إرسال SMS
class SMSService {
  constructor() {
    // يمكن استخدام خدمات SMS مختلفة
    this.providers = {
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        from: process.env.TWILIO_PHONE_NUMBER
      },
      // يمكن إضافة مزودين آخرين
    };
  }

  // إرسال SMS عبر Twilio
  async sendTwilioSMS(to, message) {
    try {
      const { accountSid, authToken, from } = this.providers.twilio;
      
      if (!accountSid || !authToken || !from) {
        console.log('إعدادات Twilio غير مكتملة، سيتم تخطي إرسال SMS');
        return { success: false, message: 'إعدادات SMS غير مكتملة' };
      }

      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          To: to,
          From: from,
          Body: message
        }),
        {
          auth: {
            username: accountSid,
            password: authToken
          }
        }
      );

      return {
        success: true,
        messageId: response.data.sid,
        message: 'تم إرسال SMS بنجاح'
      };

    } catch (error) {
      console.error('خطأ في إرسال SMS:', error.response?.data || error.message);
      return {
        success: false,
        message: 'فشل في إرسال SMS'
      };
    }
  }

  // إرسال SMS عام
  async sendSMS(to, message) {
    // يمكن إضافة منطق لاختيار أفضل مزود
    return await this.sendTwilioSMS(to, message);
  }

  // إرسال تذكير بالموعد
  async sendAppointmentReminder(appointment) {
    const message = `
تذكير بالموعد الطبي
عيادة الدكتور

مرحباً ${appointment.patientName}

موعدك الطبي:
التاريخ: ${new Date(appointment.appointmentDate).toLocaleDateString('ar-SA')}
الوقت: ${appointment.appointmentTime}

يرجى الحضور قبل الموعد بـ 10 دقائق

للاستفسارات: 01234567890
    `.trim();

    return await this.sendSMS(appointment.patientPhone, message);
  }

  // إرسال تأكيد الموعد
  async sendAppointmentConfirmation(appointment) {
    const message = `
تم تأكيد موعدك الطبي
عيادة الدكتور

مرحباً ${appointment.patientName}

تم تأكيد موعدك:
التاريخ: ${new Date(appointment.appointmentDate).toLocaleDateString('ar-SA')}
الوقت: ${appointment.appointmentTime}

يرجى الحضور قبل الموعد بـ 10 دقائق

للاستفسارات: 01234567890
    `.trim();

    return await this.sendSMS(appointment.patientPhone, message);
  }

  // إرسال إلغاء الموعد
  async sendAppointmentCancellation(appointment) {
    const message = `
تم إلغاء موعدك الطبي
عيادة الدكتور

مرحباً ${appointment.patientName}

تم إلغاء موعدك المقرر في:
التاريخ: ${new Date(appointment.appointmentDate).toLocaleDateString('ar-SA')}
الوقت: ${appointment.appointmentTime}

يمكنك حجز موعد جديد في أي وقت

للاستفسارات: 01234567890
    `.trim();

    return await this.sendSMS(appointment.patientPhone, message);
  }

  // إرسال تذكير يومي للدكتور
  async sendDailyReminderToDoctor(appointments) {
    const today = new Date().toLocaleDateString('ar-SA');
    let message = `
تذكير يومي - حجوزات اليوم
عيادة الدكتور

تاريخ اليوم: ${today}
عدد الحجوزات: ${appointments.length}

الحجوزات:
`;

    appointments.forEach((apt, index) => {
      message += `${index + 1}. ${apt.patientName} - ${apt.appointmentTime}\n`;
    });

    message += `
نتمنى لك يوم عمل مثمر!

عيادة الدكتور
    `.trim();

    // إرسال للدكتور (يمكن إضافة رقم هاتف الدكتور)
    const doctorPhone = process.env.DOCTOR_PHONE || '01234567890';
    return await this.sendSMS(doctorPhone, message);
  }
}

module.exports = new SMSService();

// Backend server URL - adjust this based on your deployment
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET المواعيد - جلب جميع المواعيد
    if (req.method === "GET") {
      const { status, date, page = 1, limit = 10 } = req.query;
      
      // بناء query parameters
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (date) queryParams.append('date', date);
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      const response = await fetch(`${BACKEND_URL}/api/appointments?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          ok: false,
          message: errorData.message || 'خطأ في جلب المواعيد',
          error: errorData.error
        });
      }

      const data = await response.json();
      return res.status(200).json({
        ok: true,
        appointments: data.data || [],
        pagination: data.pagination
      });
    }

    // POST إنشاء موعد جديد
  if (req.method === "POST") {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
      const { 
        patientName, 
        patientEmail, 
        patientPhone, 
        appointmentDate, 
        appointmentTime, 
        notes 
      } = body;

      // التحقق من البيانات المطلوبة
      if (!patientName || !patientEmail || !patientPhone || !appointmentDate || !appointmentTime) {
        return res.status(400).json({
          ok: false,
          message: 'جميع الحقول مطلوبة',
          error: 'Missing required fields'
        });
      }

      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientEmail)) {
        return res.status(400).json({
          ok: false,
          message: 'البريد الإلكتروني غير صحيح',
          error: 'Invalid email format'
        });
      }

      // التحقق من صحة رقم الهاتف
      if (patientPhone.length < 10) {
        return res.status(400).json({
          ok: false,
          message: 'رقم الهاتف غير صحيح',
          error: 'Invalid phone number'
        });
      }

      // التحقق من التاريخ
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      if (appointmentDateTime < new Date()) {
        return res.status(400).json({
          ok: false,
          message: 'لا يمكن حجز موعد في الماضي',
          error: 'Cannot book appointment in the past'
        });
      }

      // إرسال البيانات إلى الخادم الخلفي
      const response = await fetch(`${BACKEND_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName,
          patientEmail,
          patientPhone,
          appointmentDate,
          appointmentTime,
          notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          ok: false,
          message: errorData.message || 'خطأ في إنشاء الموعد',
          error: errorData.error
        });
      }

      const data = await response.json();
      return res.status(201).json({
        ok: true,
        message: 'تم إنشاء الموعد بنجاح',
        appointment: data.data
      });
    }

    // PUT تحديث موعد
    if (req.method === "PUT") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'معرف الموعد مطلوب',
          error: 'Appointment ID required'
        });
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
      
      const response = await fetch(`${BACKEND_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          ok: false,
          message: errorData.message || 'خطأ في تحديث الموعد',
          error: errorData.error
        });
      }

      const data = await response.json();
      return res.status(200).json({
        ok: true,
        message: 'تم تحديث الموعد بنجاح',
        appointment: data.data
      });
    }

    // DELETE حذف موعد
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'معرف الموعد مطلوب',
          error: 'Appointment ID required'
        });
      }

      const response = await fetch(`${BACKEND_URL}/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          ok: false,
          message: errorData.message || 'خطأ في حذف الموعد',
          error: errorData.error
        });
      }

      const data = await response.json();
      return res.status(200).json({
        ok: true,
        message: 'تم حذف الموعد بنجاح'
      });
    }

    // PATCH تحديث حالة الموعد
    if (req.method === "PATCH") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          ok: false,
          message: 'معرف الموعد مطلوب',
          error: 'Appointment ID required'
        });
      }

      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
      const { status } = body;

      if (!status) {
        return res.status(400).json({
          ok: false,
          message: 'حالة الموعد مطلوبة',
          error: 'Status required'
        });
      }

      const response = await fetch(`${BACKEND_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          ok: false,
          message: errorData.message || 'خطأ في تحديث حالة الموعد',
          error: errorData.error
        });
      }

      const data = await response.json();
      return res.status(200).json({
        ok: true,
        message: 'تم تحديث حالة الموعد بنجاح',
        appointment: data.data
      });
    }

    // Method not allowed
    res.setHeader("Allow", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    return res.status(405).json({
      ok: false,
      message: 'طريقة غير مسموحة',
      error: "Method Not Allowed"
    });

  } catch (error) {
    console.error('خطأ في API المواعيد:', error);
    return res.status(500).json({
      ok: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
}




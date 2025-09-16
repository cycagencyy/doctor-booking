// Backend server URL - adjust this based on your deployment
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ 
      ok: false, 
      message: 'طريقة غير مسموحة',
      error: "Method Not Allowed" 
    });
  }

  try {
    const { date } = req.query || {};
    
    if (!date) {
      return res.status(400).json({
        ok: false,
        message: 'التاريخ مطلوب',
        error: 'Date parameter is required'
      });
    }

    // التحقق من صحة التاريخ
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        ok: false,
        message: 'تاريخ غير صحيح',
        error: 'Invalid date format'
      });
    }

    // التحقق من أن التاريخ في المستقبل
    if (dateObj < new Date()) {
      return res.status(400).json({
        ok: false,
        message: 'لا يمكن حجز موعد في الماضي',
        error: 'Cannot book appointment in the past'
      });
    }

    // محاولة الاتصال بالخادم الخلفي
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/available/${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          ok: true,
          date: data.data.date,
          availableSlots: data.data.availableSlots || [],
          bookedSlots: data.data.bookedSlots || []
        });
      }
    } catch (backendError) {
      console.warn('Backend unavailable, using fallback slots:', backendError.message);
    }

    // Fallback: إذا لم يكن الخادم الخلفي متاحاً، استخدم الأوقات الافتراضية
    const baseSlots = [
      "09:00","09:30","10:00","10:30","11:00","11:30",
      "12:00","12:30","13:00","13:30","14:00","14:30",
      "15:00","15:30","16:00","16:30","17:00","17:30"
    ];

    return res.status(200).json({ 
      ok: true, 
      date,
      availableSlots: baseSlots,
      bookedSlots: [],
      note: 'Using fallback slots - backend unavailable'
    });

  } catch (error) {
    console.error('خطأ في API المواعيد المتاحة:', error);
    return res.status(500).json({
      ok: false,
      message: 'حدث خطأ في الخادم',
      error: error.message
    });
  }
}




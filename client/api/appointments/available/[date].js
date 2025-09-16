export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { date } = req.query || {};
  // نموذج بسيط لأوقات متاحة كل نصف ساعة من 10:00 إلى 18:00
  const baseSlots = [
    "10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30",
    "14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30",
    "18:00"
  ];

  // يمكنك لاحقاً تصفية الأوقات حسب الحجوزات الفعلية من قاعدة بيانات
  return res.status(200).json({ ok: true, data: { date, availableSlots: baseSlots } });
}



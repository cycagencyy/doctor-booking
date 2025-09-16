export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, appointments: [] });
  }
  if (req.method === "POST") {
    const { name, date, time } = (typeof req.body === 'string' ? JSON.parse(req.body||'{}') : req.body) || {};
    if (!name || !date || !time) return res.status(400).json({ ok:false, error:"Missing fields" });
    // هنا يمكنك إضافة أي لوجك حفظ (DB) لاحقاً
    return res.status(201).json({ ok:true, message:"Appointment created" });
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok:false, error:"Method Not Allowed" });
}



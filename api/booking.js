import { requireFields, isValidPhone, isValidISODate, isValidTime } from "./_utils/validate.js";
import { rateLimit } from "./_utils/rateLimit.js";
import { sendDoctorEmail } from "./_utils/mailer.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Simple per-IP rate limit (10 req / min by default)
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket?.remoteAddress;
    rateLimit(ip, { tokens: Number(process.env.RATE_TOKENS || 10), windowMs: Number(process.env.RATE_WINDOW || 60_000) });

    const { name, phone, date, time, notes } = req.body || {};
    requireFields({ name, phone, date, time }, ["name", "phone", "date", "time"]);

    if (!isValidPhone(phone)) throw Object.assign(new Error("Invalid phone"), { status: 400 });
    if (!isValidISODate(date)) throw Object.assign(new Error("Invalid date (YYYY-MM-DD)"), { status: 400 });
    if (!isValidTime(time)) throw Object.assign(new Error("Invalid time (HH:MM 24h)"), { status: 400 });

    // Email doctor
    await sendDoctorEmail({ name, phone, date, time, notes });

    return res.status(200).json({ ok: true, message: "Booking received and emailed to doctor" });
  } catch (err) {
    const code = err.status || 500;
    return res.status(code).json({ error: err.message || "Server error" });
  }
}




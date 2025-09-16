import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"Method Not Allowed" });

  const { name, email, message } = (typeof req.body === 'string' ? JSON.parse(req.body||'{}') : req.body) || {};
  if (!name || !email || !message) return res.status(400).json({ ok:false, error:"Missing fields" });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: String(process.env.EMAIL_SECURE || "true") === "true",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.DOCTOR_EMAIL || email,
      subject: `New message from ${name}`,
      text: message
    });

    return res.status(200).json({ ok:true });
  } catch (err) {
    return res.status(500).json({ ok:false, error: err.message || "Failed to send" });
  }
}



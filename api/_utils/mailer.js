import nodemailer from "nodemailer";

export function makeTransport() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
  }
  // fallback to Gmail service if only user/pass provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  }
  throw new Error("Email transport is not configured. Set EMAIL_* env vars.");
}

export async function sendDoctorEmail({ name, phone, date, time, notes }) {
  const to = process.env.DOCTOR_EMAIL;
  if (!to) throw new Error("DOCTOR_EMAIL not set");
  const subject = "New Booking / حجز جديد";
  const text =
`📅 New Booking
Name: ${name}
Phone: ${phone}
Date: ${date}  Time: ${time}
Notes: ${notes || "-"}

📅 حجز جديد
الاسم: ${name}
الهاتف: ${phone}
التاريخ: ${date}  الوقت: ${time}
ملاحظات: ${notes || "-"}`;
  const transporter = makeTransport();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text
  });
}




import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

  if (!user || !pass) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const from = process.env.GMAIL_USER;

  if (!from) {
    throw new Error("GMAIL_USER must be set");
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `NomNom <${from}>`,
    to,
    subject: "Your OTP code",
    html: `<p>Your NomNom verification code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
  });
};

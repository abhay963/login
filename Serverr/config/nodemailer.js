import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // NOTE: Ensure the SMTP_USER email domain is verified in your MailerSend account to avoid email sending errors.
  host: 'smtp.mailersend.net',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;



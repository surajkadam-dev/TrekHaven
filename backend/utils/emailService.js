import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,  // Try port 587 instead of 465
  secure: false, // false for port 587
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // May help with certificate issues
  },
  connectionTimeout: 30000, // Increase timeout to 30 seconds
  socketTimeout: 30000
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Karpewadi Homestay" <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      text,
      html
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

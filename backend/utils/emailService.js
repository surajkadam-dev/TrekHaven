import nodemailer from "nodemailer";





export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",       // don’t use "service" here
  port: 465,                    // SSL
  secure: true,                 // true because port 465
  auth: {
    user: process.env.SMTP_MAIL,      // your Gmail
    pass: process.env.SMTP_PASSWORD,  // your Gmail App Password
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});
export const sendEmail = async ({ to, subject, text,html }) => {
  await transporter.sendMail({
    from:`"Karpewadi Homestay" <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    text,
    html
  });
};

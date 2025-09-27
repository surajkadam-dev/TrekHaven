import nodemailer from "nodemailer";

<<<<<<< HEAD



export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  secure:true,
=======
export const transporter = nodemailer.createTransport({
 service: "gmail", 
 port:465,
 secure:true,
>>>>>>> 46f2d75f157214bee2d7634c5399254f029bcc71
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

<<<<<<< HEAD

export const sendEmail = async ({ to, subject, text,html }) => {
  await transporter.sendMail({
    from:`"Karpewadi Homestay" <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    text,
    html
  });
=======
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
>>>>>>> 46f2d75f157214bee2d7634c5399254f029bcc71
};

import SibApiV3Sdk from "sib-api-v3-sdk";
import { config } from "dotenv";
config({ path: './config/config.env' });

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error("Recipient email is required");

  try {
    await tranEmailApi.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL, name: "KarapewadiHomestay" },
      to: [{ email: to }], // ✅ Correct format
      subject,
      htmlContent: html,
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
};

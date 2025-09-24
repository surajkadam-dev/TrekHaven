import app from "./app.js";
import { config } from "dotenv";
import { transporter } from "./utils/emailService.js";


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  // verify SMTP transporter at startup
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP not ready:", error.message);
    } else {
      console.log("✅ SMTP ready to send messages");
    }
  });
});

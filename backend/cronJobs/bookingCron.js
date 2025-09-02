import cron from "node-cron";
import { autoCompleteBookings } from "../services/bookingService.js";

export const bookingCronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏳ Running booking auto-completion job...");
    try {
      const result = await autoCompleteBookings();
    } catch (err) {
      console.error("❌ Booking auto-complete failed:", err.message);
    }
  });
};
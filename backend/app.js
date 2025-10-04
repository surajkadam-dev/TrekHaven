import express from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connection } from './database/connection.js';
import userRoutes from './Routes/userRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import bookingRoutes from './Routes/bookingRoutes.js';
import testimonialRoutes from "./Routes/TestimonialRoutes.js";
import refundRoutes from "./Routes/refundRoutes.js"
import { razorpayWebhook } from './controllers/bookingController.js';
import { bookingCronJob } from './cronJobs/bookingCron.js';
import otpRoutes from './Routes/otpRoutes.js';
import paymentRoutes from "./Routes/paymentRoutes.js"
import EmergencyUpdateRoutes from "./Routes/emergencyUpdateRoutes.js"
const app=express();
config({
  path:'./config/config.env'
});
 app.use(cors(
  {
origin:[process.env.FRONTEND_URL,"http://localhost:5173"], //process.env.FRONTEND_URL],
methods:["GET","POST","PUT","DELETE"],
credentials:true
  }
 ));



app.post("/razorpay/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

  app.use(cookieParser());
    app.use(express.json());
 app.use(express.urlencoded({extended:true}))

   app.use("/api/v1/user",userRoutes)
   app.use("/api/v1/admin",adminRoutes)
  app.use("/api/v1/booking",bookingRoutes);
  app.use("/api/v1/testimonial",testimonialRoutes);
  app.use("/api/v1/refund",refundRoutes);
  app.use("/api/v1/otp",otpRoutes);
  app.use("/api/v1/payments",paymentRoutes);
  app.use("/api/v1/emergency-request",EmergencyUpdateRoutes); 
 connection();
 bookingCronJob();

export default app;

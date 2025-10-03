import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/error.js';
import Accommodation from '../models/Admin.model.js';
import Booking from '../models/Booking.model.js';
import mongoose  from 'mongoose';
import { config } from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto'
import Payment from '../models/Payment.model.js';
import RefundRequest from '../models/RefundRequest.model.js';
import { sendEmail } from '../utils/emailService.js';
import { saveTempBooking,getTempBooking,deleteTempBooking} from '../utils/tempBookings.js';
import {getBookedSeatsForDate} from "../helper/capacity.js";
import {autoCompleteBookings} from "../services/bookingService.js"
import { isSameDayBookingClosed } from '../helper/sameDayBookingClose.js';

import { v4 as uuidv4 } from 'uuid';

config({
  path:'./config/config.env'
});

const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
});

export const createBookingOrder = async (req, res, next) => {
  try {
    const { accommodationId } = req.params;
    console.log("api hit")
 
    const {
      stayDate,
      groupSize,
      mealType,
      needStay,
      stayNight,
      amount,
      groupName,
      paymentMode,
      name,
      email,
      phone
    } = req.body;
  

    
    if (!stayDate || !groupSize || !mealType || !amount || !paymentMode || !name || !email || !phone) {
      return res.json({ success: false, error: "Missing required fields" });
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.json({ success: false, error: "Accommodation not found" });
    }

    const size = Number(groupSize);
    if (isNaN(size) || size < 1) {
      return res.json({ success: false, error: "Invalid group size" });
    }

    const date = new Date(stayDate);
    if (isNaN(date.getTime())) {
      return res.json({ success: false, error: "Invalid stay date" });
    }
<<<<<<< HEAD
const now = new Date();
const cutoffTime=17;
if(date.toDateString()=== new Date().toDateString() && now.getHours() >= cutoffTime)
{
  return res.json({
    success:false,
    error:"Same-day booking closed after 5 PM."
  })
}
    
=======
    if (isSameDayBookingClosed(stayDate, 17)) {
      return res.json({
        success: false,
        error: "Same-day booking closed after 5 PM."
      });
    }
    // Calculate expected amount
>>>>>>> f88c6a70b0d4726b99cbc688858e54267648d00e
    const mealRate = mealType === "nonveg" ? accommodation.nonVegRate : accommodation.vegRate;
    const mealAmount = needStay ? mealRate * stayNight * size : mealRate * size;
    const stayAmount = needStay ? accommodation.pricePerNight * stayNight * size : 0;
    const expectedAmount = mealAmount + stayAmount;

    
const depositAmount = paymentMode === 'cash' ? expectedAmount / 2 : expectedAmount; 
const expectedChargeAmount = paymentMode === 'online' ? depositAmount : expectedAmount;

if (amount !== expectedChargeAmount) {
  return res.json({
    success: false,
    error: `Amount mismatch. Expected: ${expectedChargeAmount}, Received: ${amount}`
  });
}
const start = new Date(stayDate);
start.setUTCHours(0, 0, 0, 0);

const end = new Date(start);
end.setUTCDate(end.getUTCDate() + 1);


 

  const duplicate = await Booking.findOne({
      user: req.user._id,
      stayDate: { $gte: start, $lt: end },
      status: { $nin: ["cancelled", "completed"] }
    });



  if (duplicate) return res.status(400).json({ success: false, error: "You already have a booking for this date." });

   const alreadyBooked = await getBookedSeatsForDate(start);
    const seatsLeft = accommodation.maxMembers - alreadyBooked;
   
    if (size > seatsLeft) {
      return res.status(400).json({
        success: false,
        error: `Not enough capacity for ${start.toISOString().slice(0, 10)}. Available seats: ${seatsLeft}`
      });
    }

    

    const bookingToken = uuidv4();
    await saveTempBooking(bookingToken, {
 
  accommodationId,
  name,
  email,
  phone,
  groupName,
  stayDate:start.toISOString(),
  groupSize,
  mealType,
  needStay,
  stayNight,
  paymentMode,
  fullAmount: expectedAmount,
  depositAmount,
});
const options = {
  amount: Math.round(depositAmount * 100),
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
  payment_capture: 1,
  notes: {
    userId: req.user._id,
    bookingToken,
  },
};

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      razorpayOrder: order,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      depositAmount,
      fullAmount: expectedAmount,
      message: "Order created. Complete payment to confirm booking."
    });
  } catch (error) {
    next(error);
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }

    
    res.json({
      success: true,
      message: "Payment verified. Booking will be confirmed shortly once Razorpay notifies us."
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    
    const bodyBuffer = req.body;
    const bodyString = bodyBuffer.toString("utf8");

    
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyString)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const payload = JSON.parse(bodyString);
    const event = payload.event;

    
    if (event === "payment.captured" || event === "payment.failed") {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes;

      
      let paymentDoc = await Payment.findOne({ razorpayPaymentId: paymentEntity.id });
      if (!paymentDoc) {
        await Payment.create({
          user: notes.userId,
          razorpayOrderId: paymentEntity.order_id,
          razorpayPaymentId: paymentEntity.id,
          amount: paymentEntity.amount / 100,
          status: event === "payment.captured" ? "paid" : "failed",
          bookingCreated:false,
          refundStatus: "none",
        });
      }

      
if (event === "payment.captured") {
  const paymentEntity = payload.payload.payment.entity;
  const bookingToken = paymentEntity.notes.bookingToken;

 try {
   const bookingData = await getTempBooking(bookingToken);
  if (!bookingData) {
    console.warn("Booking token not found:", bookingToken);
        await razorpay.refunds.create({
        payment_id: paymentEntity.id,
        amount: paymentEntity.amount, 
        speed: "optimum",
        notes: { reason: "Booking token missing" }
      });
       return res.status(400).send("Refund initiated due to invalid booking token");
  }

  const booking = await Booking.create({
    user: notes.userId,
    name: bookingData.name,
    accommodation: bookingData.accommodationId,
    email: bookingData.email,
    phone: bookingData.phone,
    groupName: bookingData.groupName,
    stayDate: bookingData.stayDate,
    paymentMode: bookingData.paymentMode,
    amount: bookingData.fullAmount,
    depositAmount: bookingData.depositAmount,
    mealType: bookingData.mealType,
    needStay: bookingData.needStay,
    stayNight: bookingData.stayNight,
    groupSize: bookingData.groupSize,
    depositPaid: bookingData.paymentMode === "cash" ? true : false,
    remainingAmount: bookingData.paymentMode === "cash" ? bookingData.fullAmount - bookingData.depositAmount : 0,
    paymentStatus: bookingData.paymentMode === "cash" ? "pending" : "paid",
    status: "confirmed",
    razorpayOrderId: paymentEntity.order_id,
    transactionId: paymentEntity.id,
  });


  
await Payment.findOneAndUpdate(
  { razorpayPaymentId: paymentEntity.id },
  {
    booking: booking._id,
    bookingCreated: true,
    refundStatus: "none",
    status: "paid"
  }
);
  await deleteTempBooking(bookingToken);
  await sendEmail({
  to: booking.email,
  subject: "Booking Confirm",
  html: `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(20,20,20,0.08);">
            
            <!-- content -->
            <tr>
              <td style="padding:28px 36px 18px 36px;font-family:Arial, Helvetica, sans-serif;color:#0f1724;">
                <h1 style="margin:0;font-size:20px;font-weight:700;color:#0b2545;">बुकिंग पुष्टी ✅</h1>
                <p style="margin:12px 0 20px;font-size:15px;line-height:1.5;color:#4b5563;">
                  नमस्कार <strong>${booking.name}</strong>,<br><br>
                  तुमची बुकिंग <strong>#${booking._id}</strong> यशस्वीरीत्या निश्चित झाली आहे.  
                  तुमच्या बुकिंगची माहिती खाली दिली आहे:
                </p>

                <!-- details card -->
                <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border:1px solid #e6e9ee;border-radius:8px;background:#fbfdff;">
                  <tr>
                    <td style="padding:14px 16px;font-size:14px;color:#334155;line-height:1.6;">
                      <strong>गट नाव:</strong> ${booking.groupName}<br>
                      <strong>निवास प्रकार:</strong> ${booking.accommodation}<br>
                      <strong>राहण्याची तारीख:</strong> ${new Date(booking.stayDate).toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" })}<br>
                      <strong>राहण्याची रात्र:</strong> ${booking.stayNight}<br>
                      <strong>जेवण प्रकार:</strong> ${booking.mealType}<br>
                      <strong>निवास आवश्यक:</strong> ${booking.needStay ? "होय" : "नाही"}<br>
                      <strong>गट आकार:</strong> ${booking.groupSize}<br><br>

                      <strong>पेमेंट प्रकार:</strong> ${booking.paymentMode}<br>
                      <strong>एकूण रक्कम:</strong> ₹${booking.amount}<br>
                      <strong>अधि भरणा:</strong> ₹${booking.depositAmount}<br>
                      <strong>बाकी रक्कम:</strong> ₹${booking.remainingAmount}<br>
                      <strong>पेमेंट स्थिती:</strong> ${booking.paymentStatus}<br><br>

                      <strong>ट्रान्झॅक्शन ID:</strong> ${booking.transactionId}<br>
                      <strong>Razorpay Order ID:</strong> ${booking.razorpayOrderId}<br>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <p style="margin:18px 0 0;">
                  <a href="${booking.manageUrl ?? '#'}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#0b7bff;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
                    बुकिंग व्यवस्थापित करा
                  </a>
                </p>
              </td>
            </tr>

            <!-- divider -->
            <tr>
              <td style="padding:0 36px;">
                <hr style="border:none;border-top:1px solid #eef2f7;margin:0;">
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td style="padding:18px 36px 28px;font-family:Arial, Helvetica, sans-serif;font-size:13px;color:#6b7280;">
                <p style="margin:0 0 8px;">काही प्रश्न असल्यास, या ईमेलला उत्तर देऊ नका किंवा आमच्या समर्थनाशी संपर्क साधा: <a href="mailto:support@your-domain.com" style="color:#0b7bff;text-decoration:none;">support@your-domain.com</a>.</p>
                <p style="margin:0;font-size:12px;color:#9aa3b2;">&copy; ${new Date().getFullYear()} करपेवाईडी होम स्टे. सर्व हक्क राखीव.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
});
  
 } catch (error) {
   console.error("Booking creation failed after payment:", error);
     try {
      await razorpay.refunds.create({
        payment_id: paymentEntity.id,
        amount: paymentEntity.amount,
        speed: "optimum",
        notes: { reason: "Booking creation failed" }
      });
      await Payment.findOneAndUpdate(
  { razorpayPaymentId: paymentEntity.id },
  {
    bookingCreated: false,
    refundStatus: "initiated",
    status: "refunded"
  }
);


    await sendEmail({
  to: paymentEntity.email || bookingData?.email,
  subject: "Booking Failed – Refund Initiated ❌",
  html: `
  <html>
    <body style="font-family:Arial, sans-serif; background:#f4f6f8; padding:20px;">
      <table style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
        <tr>
          <td>
            <h2 style="color:#d32f2f;">Booking Failed ❌</h2>
            <p>Hi <strong>${bookingData?.name || "Guest"}</strong>,</p>
            <p>We’re sorry! Your booking could not be completed.  
            Don’t worry – your payment of <strong>₹${paymentEntity.amount / 100}</strong>  
            has been refunded back to your account.</p>
            <p>It may take <strong>3–4 business working days</strong> to reflect in your bank.</p>
            <p>We sincerely apologize for the inconvenience 🙏.  
            Please try booking again or contact our support if you face issues.</p>
            <p style="margin-top:20px;font-size:14px;color:#555;">
              Regards,<br/>Team Karpewadi Homestay
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
});

    } catch (refundErr) {
      console.error("Refund initiation failed:", refundErr);
    }
  
 }


} else {
        console.log("❌ Payment failed, booking not created.");
      }
    }

    
    if (event.startsWith("payment.refund")) {
      const refundEntity = payload.payload.refund?.entity || payload.payload.refund || {};
      const refundId = refundEntity.id;
      const paymentId = refundEntity.payment_id;
      const amount = (refundEntity.amount || 0) / 100;
      const status = refundEntity.status;

      let refundReq = await RefundRequest.findOne({ refundPaymentId: refundId });
      const paymentDocId = await Payment.findOne({ razorpayPaymentId: paymentId });
      if (!refundReq) {
        const paymentDoc = await Payment.findOne({ razorpayPaymentId: paymentId });
        if (paymentDoc) {
          refundReq = await RefundRequest.findOne({
            payment: paymentDoc._id,
            amount,
            status: { $in: ["initiated", "processing"] },
          });
        }
        
      }

      if (!refundReq) {
        console.warn("Unmatched refund webhook", refundId, paymentId);
        return res.status(200).send("ok");
      }

      let timelineEntry = {};

      if (status === "successful" || status === "paid") {
        refundReq.status = "refunded";
        refundReq.refundedAt = new Date();
        timelineEntry = { status: "refunded", message: "Refund successfully credited.", date: new Date() };

        await Booking.findByIdAndUpdate(refundReq.booking, {
          refundStatus: "refunded",
          refundId,
          refundedAt: new Date(),
        });
  await Payment.findByIdAndUpdate(paymentDocId._id, {
    refunded: true,
    refundStatus: "refunded"
  });
        const booking = await Booking.findById(refundReq.booking);
await sendEmail({
  to: booking.email,
  subject: "रिफंड यशस्वी ✅",
  html: `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(20,20,20,0.08);">
            
            <tr>
              <td style="padding:28px 36px 18px 36px;font-family:Arial, Helvetica, sans-serif;color:#0f1724;">
                <h1 style="margin:0;font-size:20px;font-weight:700;color:#0b2545;">रिफंड यशस्वी ✅</h1>
                <p style="margin:12px 0 20px;font-size:15px;line-height:1.5;color:#4b5563;">
                  नमस्कार <strong>${booking.name}</strong>,<br><br>
                  तुमच्या बुकिंग <strong>#${booking._id}</strong> साठी ₹${amount} रक्कम यशस्वीरीत्या तुमच्या बँक खात्यात जमा केली गेली आहे.
                </p>

                <p style="margin-top:32px;font-size:14px;color:#0f1724;font-weight:600;">
                  शुभेच्छा,<br>Team करपेवाईडी होम स्टे
                </p>

                <p style="margin-top:30px;font-size:12px;color:#9aa3b2;">
                  हे स्वयंचलित सूचना ईमेल आहे. कृपया उत्तर देऊ नका.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
});

      } else if (status === "failed") {
        refundReq.status = "failed";
        refundReq.failedAt = new Date();
        timelineEntry = { status: "failed", message: "Refund failed at Razorpay.", date: new Date() };
  await Payment.findByIdAndUpdate(paymentDocId._id, {
    refundStatus: "failed"
  });
        await Booking.findByIdAndUpdate(refundReq.booking, { refundStatus: "failed" });

      } else if (status === "processed" || status === "created" || status === "pending") {
        refundReq.status = "processing";
        refundReq.processedAt = new Date();
        timelineEntry = { status: "processing", message: "Refund request is being processed by Razorpay.", date: new Date() };
  await Payment.findByIdAndUpdate(paymentDocId._id, {
    refundStatus: "processing"
  });
        await Booking.findByIdAndUpdate(refundReq.booking, { refundStatus: "processing" });
      }

      refundReq.refundPaymentId = refundId;
      if (timelineEntry.status) {
        refundReq.timeline.push(timelineEntry);
      }
      await refundReq.save();
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("razorpayWebhook error:", err);
    res.status(500).send("server error");
  }
};

export const completeOldBookings = async (req, res, next) => {
  try {
    const result = await autoCompleteBookings();
    res.status(200).json({
      success: true,
      message: "Bookings completed successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
}




export const checkBookingConfirmation = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    
    const booking = await Booking.findOne({ razorpayOrderId: orderId });
    
    if (booking) {
      return res.json({ 
        success: true, 
        booking,
        message: "Booking confirmed" 
      });
    }
    
    
    return res.json({ 
      success: false, 
      message: "Booking not yet confirmed" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getMyBookings = catchAsyncErrors(async (req, res, next) => {
try {
  
    const userId = req.user._id;

  const bookings = await Booking.find({ user: userId }).sort({ stayDate: -1 });

  
  
  

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
} catch (error) {
  console.log(error);
}
});

  






    








































 





    








    







    




    









export const deleteBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user._id;
    const role = req.user.role; 

    
    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    
    if (role === "trekker" && booking.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Unauthorized to delete this booking" });
    }

    
    if (!["cancelled", "completed"].includes(booking.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Only cancelled or completed bookings can be deleted" });
    }

    
    if (role === "admin") {
      booking.deletedBy.admin = true;
    } else if (role === "trekker") {
      booking.deletedBy.user = true;
      
    }

    await booking.save({ session });

    
    if (booking.deletedBy.admin && booking.deletedBy.user) {
      await Booking.deleteOne({ _id: booking._id }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: booking.deletedBy.admin && booking.deletedBy.user
        ? "Booking permanently deleted"
        : "Booking marked as deleted"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Delete booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const cancelThenAutoRefund = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction(); session.endSession();
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== userId.toString()) {
      await session.abortTransaction(); session.endSession();
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
    }

    if (booking.status === 'completed') {
      await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: 'Completed bookings cannot be canceled' });
    }
    if (booking.status === 'cancelled') {
      await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    
    const now = new Date();
    const bookingTime = new Date(booking.createdAt);
    const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      await session.abortTransaction(); session.endSession();
      return res.status(400).json({ success: false, message: 'Cancellation period expired (24 hours)' });
    }

    
    const existing = await RefundRequest.findOne({
      booking: booking._id,
      status: { $in: ['initiated', 'processing'] }
    }).session(session);
    if (existing) {
      await session.abortTransaction(); session.endSession();
      return res.status(409).json({ success: false, message: 'Refund already in progress for this booking' });
    }

    
    let refundableAmount = 0;
    if (booking.paymentMode === 'cash') {
      refundableAmount = booking.depositAmount || 0;
    } else {
      refundableAmount = booking.depositAmount ?? booking.amount ?? 0;
    }

    refundableAmount = refundableAmount * 0.75;
refundableAmount = Math.round(refundableAmount);
    
    booking.status = 'cancelled';
    booking.refundRequested = true;
    booking.refundAmount = refundableAmount;
    booking.refundStatus = booking.paymentMode === 'cash' ? 'initiated' : 'processing';
    await booking.save({ session });

    const accommodation = await Accommodation.findById(booking.accommodation).session(session);
    if (accommodation) {
      accommodation.bookedMembers = Math.max(0, accommodation.bookedMembers - (booking.groupSize || 1));
      await accommodation.save({ session });
    }

    
    let paymentDoc = null;
    if (booking.razorpayOrderId) {
      paymentDoc = await Payment.findOne({ razorpayOrderId: booking.razorpayOrderId }).session(session);
    }
    if (!paymentDoc && booking.transactionId) {
      paymentDoc = await Payment.findOne({ razorpayPaymentId: booking.transactionId }).session(session);
    }

    
    const [refundReq] = await RefundRequest.create([{
      booking: booking._id,
      user: userId,
      payment: paymentDoc ? paymentDoc._id : undefined,
      method: booking.paymentMode === 'cash' ? 'cash' : 'razorpay',
      amount: refundableAmount,
      reason: req.body.reason || 'User cancelled within refund window',
      status: booking.paymentMode === 'cash' ? 'initiated' : 'processing',
      initiatedAt: new Date(),
      timeline: [
        { status: "initiated", message: "Refund request initiated by user.", date: new Date() }
      ]
    }], { session });

await sendEmail({
  to: booking.email,
  subject: "रिफंड विनंती सुरू केली 🔄",
  html: `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(20,20,20,0.08);">
            
            <tr>
              <td style="padding:28px 36px 18px 36px;font-family:Arial, Helvetica, sans-serif;color:#0f1724;">
                <h1 style="margin:0;font-size:20px;font-weight:700;color:#0b2545;">रिफंड विनंती प्राप्त झाली 🔄</h1>
                
                <p style="margin:12px 0 20px;font-size:15px;line-height:1.5;color:#4b5563;">
                  नमस्कार <strong>${booking.name}</strong>,<br><br>
                  तुमची बुकिंग <strong>${new Date(booking.stayDate).toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" })}</strong> साठी रिफंड विनंती आम्हाला प्राप्त झाली आहे.
                </p>

                <p style="margin:12px 0 20px;font-size:15px;line-height:1.5;color:#4b5563;">
                  या रिफंडवर <strong>२५% कॅन्सलेशन शुल्क</strong> आकारले गेले आहे. त्यामुळे तुम्हाला परत मिळणारी रक्कम असेल:  
                  <strong>₹${booking.refundAmount}</strong>
                </p>

                <p style="margin:12px 0 20px;font-size:15px;line-height:1.5;color:#4b5563;">
                  रिफंड प्रक्रिया पूर्ण झाल्यानंतर आम्ही तुम्हाला पुष्टी ईमेल पाठवू.
                </p>

                <p style="margin-top:32px;font-size:14px;color:#0f1724;font-weight:600;">
                  शुभेच्छा,<br>Team करपेवाईडी होम स्टे
                </p>

                <p style="margin-top:30px;font-size:12px;color:#9aa3b2;">
                  हे स्वयंचलित सूचना ईमेल आहे. कृपया उत्तर देऊ नका.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
});


    await session.commitTransaction();
    session.endSession();

    
    try {
      const razorpayPaymentId = (paymentDoc && paymentDoc.razorpayPaymentId) || booking.transactionId;
      if (!razorpayPaymentId) {
        await RefundRequest.findByIdAndUpdate(refundReq._id, { 
          status: 'failed', 
          failedAt: new Date(),
          $push: { timeline: { status: "failed", message: "Missing original payment ID", date: new Date() } }
        });
        await Booking.findByIdAndUpdate(booking._id, { refundStatus: 'failed' });
        return res.status(400).json({ success: false, message: 'Original payment id missing; cannot auto-refund.' });
      }

      const amountPaise = Math.round(refundableAmount * 100);
      const refundResponse = await razorpay.payments.refund(razorpayPaymentId, { amount: amountPaise });

      const refundId = refundResponse && (refundResponse.id || (refundResponse.entity && refundResponse.entity.id));
      const gatewayStatus = refundResponse && (refundResponse.status || (refundResponse.entity && refundResponse.entity.status));

      const update = { refundPaymentId: refundId, processedAt: new Date() };
      let timelineEntry = {};

      if (gatewayStatus && (gatewayStatus === 'successful' || gatewayStatus === 'paid')) {
        update.status = 'refunded';
        update.refundedAt = new Date();
        timelineEntry = { status: "refunded", message: "Refund completed instantly by Razorpay.", date: new Date() };
        await Booking.findByIdAndUpdate(booking._id, { refundStatus: 'refunded', refundId, refundedAt: new Date() });
        await Payment.findByIdAndUpdate(paymentDoc._id,{refunded:true});
      } else {
        update.status = 'processing';
        timelineEntry = { status: "processing", message: "Refund request sent to Razorpay.", date: new Date() };
        await Booking.findByIdAndUpdate(booking._id, { refundStatus: 'processing', refundId });
      }

      update.$push = { timeline: timelineEntry };
      await RefundRequest.findByIdAndUpdate(refundReq._id, update, { new: true });

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled and refund triggered; final confirmation will come via webhook.',
        refundResponse
      });

    } catch (gatewayErr) {
      console.error('Gateway refund error', gatewayErr);
      await RefundRequest.findByIdAndUpdate(refundReq._id, { 
        status: 'failed', 
        failedAt: new Date(),
        $push: { timeline: { status: "failed", message: `Gateway error: ${gatewayErr.message}`, date: new Date() } }
      });
      await Booking.findByIdAndUpdate(booking._id, { refundStatus: 'failed' });
      await sendEmail({
        to: booking.email,
        subject: "Refund Failed",
        text: `Booking cancelled but refund attempt failed. Admin will review.`
      });
      return res.status(500).json({ success: false, message: 'Booking cancelled but refund attempt failed. Admin will review.', error: gatewayErr.message });
    }

  } catch (err) {
    try { await session.abortTransaction(); } catch (e) {}
    session.endSession();
    console.error('cancelThenAutoRefund error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};



export const adminProcessRefund = async (req, res) => {

  try {
    const user = req.user;
    if (!user?.isAdmin) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const { refundId } = req.params;
    const { action, adminNotes } = req.body;

    const refundReq = await RefundRequest.findById(refundId).populate('payment booking');
    if (!refundReq) return res.status(404).json({ success: false, message: 'Refund request not found' });
    
    if (refundReq.method === 'cash') {
      refundReq.status = 'refunded';
      refundReq.adminNotes = (refundReq.adminNotes || '') + '\n' + (adminNotes || `Cash refunded by admin ${user._id}`);
      refundReq.processedAt = new Date();
      await refundReq.save();

      await Booking.findByIdAndUpdate(refundReq.booking, {
        refundStatus: 'refunded',
        refundId: `cash_${refundReq._id}`,
        refundedAt: new Date()
      });

      return res.json({ success: true, message: 'Cash refund marked as completed', refundReq });
    }

    
    if (refundReq.method === 'razorpay') {
      if (refundReq.status === 'processing') {
        return res.status(400).json({ success: false, message: 'Refund already processing' });
      }

      
      let razorpayPaymentId = null;
      if (refundReq.payment && refundReq.payment.razorpayPaymentId) {
        razorpayPaymentId = refundReq.payment.razorpayPaymentId;
      } else {
        const booking = await Booking.findById(refundReq.booking);
        razorpayPaymentId = booking?.transactionId;
      }

      if (!razorpayPaymentId) {
        refundReq.status = 'failed';
        refundReq.adminNotes = (refundReq.adminNotes || '') + '\n' + 'Cannot find original payment id for gateway refund';
        await refundReq.save();
        return res.status(400).json({ success: false, message: 'Original payment id missing' });
      }

      try {
        refundReq.status = 'processing';
        await refundReq.save();

        const amountPaise = Math.round(refundReq.amount * 100);
        const refundResponse = await razorpay.payments.refund(razorpayPaymentId, { amount: amountPaise });

        const refundGatewayId = refundResponse && (refundResponse.id || (refundResponse.entity && refundResponse.entity.id));
        const gatewayStatus = refundResponse && (refundResponse.status || (refundResponse.entity && refundResponse.entity.status));

        refundReq.refundPaymentId = refundGatewayId;
        refundReq.processedAt = new Date();
        refundReq.adminNotes = (refundReq.adminNotes || '') + '\n' + (adminNotes || `Refund retried by admin ${user._id}`);
        refundReq.status = (gatewayStatus && (gatewayStatus === 'processed' || gatewayStatus === 'successful' || gatewayStatus === 'paid')) ? 'refunded' : 'processing';
        await refundReq.save();

        if (refundReq.status === 'refunded') {
          await Booking.findByIdAndUpdate(refundReq.booking, { refundStatus: 'refunded', refundId: refundGatewayId, refundedAt: new Date() });
        }

        return res.json({ success: true, message: 'Gateway refund triggered', refundResponse });
      } catch (err) {
        console.error('admin retry refund error', err);
        refundReq.status = 'failed';
        refundReq.adminNotes = (refundReq.adminNotes || '') + '\n' + `Gateway retry error: ${err.message}`;
        await refundReq.save();
        await Booking.findByIdAndUpdate(refundReq.booking, { refundStatus: 'failed' });
        return res.status(500).json({ success: false, message: 'Gateway refund retry failed', error: err.message });
      }
    }

    return res.status(400).json({ success: false, message: 'Unsupported refund method' });
  } catch (err) {
    console.error('adminProcessRefund error', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};



export const getRefundStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== userId.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const refundReq = await RefundRequest.findOne({ booking: booking._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      booking: {
        id: booking._id,
        status: booking.status,
        refundStatus: booking.refundStatus,
        refundAmount: booking.refundAmount,
        refundId: booking.refundId || null
      },
      refundRequest: refundReq || null
    });
  } catch (err) {
    console.error('getRefundStatus error', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
  

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    
    if (
      req.user.role !== "admin" &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};


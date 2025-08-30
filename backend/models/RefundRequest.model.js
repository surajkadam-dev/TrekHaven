// models/RefundRequest.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RefundRequestSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' }, // optional link to original payment document
  method: { type: String, enum: ['razorpay', 'cash'], required: true },
  amount: { type: Number, required: true }, // INR decimal, e.g. 500.0
  currency: { type: String, default: 'INR' },
  refundPaymentId: { type: String }, // gateway refund id (Razorpay refund id)
  status: { 
    type: String, 
    enum: ['initiated','processing','failed','refunded','cancelled'], 
    default: 'initiated' 
  },
  reason: { type: String },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
 timeline: [
    {
      status: String,
      message: String,
      date: { type: Date, default: Date.now }
    }
  ],

  // ✅ timestamps for major states
  initiatedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },   // when sent to Razorpay
  refundedAt: { type: Date },    // when refund completed
  failedAt: { type: Date } 
}, {
  timestamps: true
});

export default model('RefundRequest', RefundRequestSchema);

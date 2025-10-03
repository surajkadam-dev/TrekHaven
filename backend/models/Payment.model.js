import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking' 
  },

  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },

  razorpayPaymentId: {
    type: String,
    required: true,
    unique: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  // ✅ Your detailed refund lifecycle
  refundStatus: { 
    type: String, 
    enum: ['none', 'requested', 'initiated', 'processing', 'refunded', 'failed'], 
    default: 'none' 
  },

  refundId: { type: String },  // Razorpay refund_id when available

  method: { type: String },    // UPI, card, netbanking, etc.

  // ✅ Track if a booking was successfully created after payment
  bookingCreated: { 
    type: Boolean, 
    default: false 
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  metadata: {
    type: Object, // Store extra info like group size, accommodationId, etc.
    default: {}
  }
});


export default mongoose.model('Payment', paymentSchema);

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
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
    enum: ['pending', 'paid', 'failed','refunded'],
    default: 'pending'
  },
  refunded: { type: Boolean, default: false },
  refundId: { type: String },  // gateway refund id when refunded
  method: { type: String },    // 
  createdAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object, // optional: store additional info like accommodationId, groupSize, etc.
    default: {}
  }
});

export default mongoose.model('Payment', paymentSchema);

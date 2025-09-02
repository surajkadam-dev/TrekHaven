import mongoose from 'mongoose';
import Accommodation from './Admin.model.js';
import validator from 'validator';

const { Schema, model } = mongoose;

const BookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accommodation:  { type: Schema.Types.ObjectId, ref: 'Accommodation', required: true },
  name:{type:String,required:true},
  email: { type: String, required: true, validate: [validator.isEmail, 'Invalid email'] },
  phone: { type: String, required: true, validate: [validator.isMobilePhone, 'Invalid phone number'] },
  groupName:{type:String,default:""},
  stayDate:    { type: Date, default: Date.now },
  paymentMode:    { type: String, enum: ['online', 'cash'], required: true },
  paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  amount:         { type: Number, required: true },
  status:         { type: String, enum: ['pending', 'confirmed', 'cancelled','completed'], default: 'pending' },
  groupSize:      { type: Number, required: true, min: 1 },
  needStay:       { type: Boolean, default: true },
  stayNight:      { type: Number, default: 1, min: 0 },
  mealType:       { type: String, enum: ['veg', 'nonveg'], required: true },
  // In your Booking model, add these fields:
depositAmount: {
  type: Number,
  default: 0
},
remainingAmount: {
  type: Number,
  default: 0
},
 paymentGateway: { type: String }, 
depositPaid: {
  type: Boolean,
  default: false
},
  transactionId: {type:String},

  refundRequested: { type: Boolean, default: false },
  refundStatus: { 
    type: String, 
    enum: ['none','requested','processing','refunded','failed','initiated'], 
    default: 'none' 
  },
  refundAmount: { type: Number, default: 0 },
  refundId: { type: String },     // gateway refund id or internal cash refund id
  refundedAt: { type: Date },
  razorpayOrderId: { type: String },
    deletedBy: {
      user: { type: Boolean, default: false },
      admin: { type: Boolean, default: false },
    },
    paymentUpdates: [
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    from: String,
    to: String,
    at: Date,
  }
],
paymentUpdatedAt: Date

  }, { timestamps: true });

BookingSchema.pre('validate', async function(next) {
  const acc = await Accommodation.findById(this.accommodation);
  if (!acc) return next(new Error('Accommodation not found'));
  if (acc.bookedMembers + this.groupSize > acc.maxMembers) {
    return next(new Error('Exceeds capacity'));
  }
  const mealRate = this.mealType === 'nonveg' ? acc.nonVegRate : acc.vegRate;
  const mealAmount = mealRate * this.groupSize;
  const stayAmount = this.needStay ? acc.pricePerNight * this.stayNight * this.groupSize : 0;
  this.amount = mealAmount + stayAmount;
  next();
});

BookingSchema.post('save', async function(doc, next) {
  if (doc.status === 'confirmed') {
    await Accommodation.findByIdAndUpdate(doc.accommodation, { $inc: { bookedMembers: doc.groupSize } });
  }
  next();
});

export default model('Booking', BookingSchema);
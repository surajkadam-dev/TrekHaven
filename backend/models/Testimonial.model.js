import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // admin can moderate
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;

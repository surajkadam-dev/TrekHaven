import mongoose from "mongoose";

const emergencyUpdateRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  newEmail: { type: String },
  newMobile: { type: String },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
});

export default mongoose.model("EmergencyUpdateRequest", emergencyUpdateRequestSchema);

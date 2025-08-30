import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AccommodationSchema = new Schema({
  maxMembers:    { type: Number, required: true, default: 0 },
  bookedMembers: { type: Number, required: true, default: 0 },
  vegRate:       { type: Number, required: true ,default:200},
  nonVegRate:    { type: Number, required: true ,default:350},
  pricePerNight: { type: Number, required: true ,default:200},
}, { timestamps: true });

export default model('Accommodation', AccommodationSchema);

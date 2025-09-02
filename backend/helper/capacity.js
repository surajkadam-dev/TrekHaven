import mongoose from "mongoose";
import Booking from "../models/Booking.model.js";
import Accommodation from "../models/Admin.model.js";

export async function getBookedSeatsForDate(accommodationId, stayDateInput) {
  // find the accommodation if id not provided
  let accommodationDocId = accommodationId;
  if (!accommodationDocId) {
    const ac = await Accommodation.findOne().select("_id");
    if (!ac) throw new Error("Accommodation not found");
    accommodationDocId = ac._id;
  }

  const start = new Date(stayDateInput);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const agg = await Booking.aggregate([
    {
      $match: {
        accommodation: new mongoose.Types.ObjectId(accommodationDocId),
        stayDate: { $gte: start, $lt: end },
        status: { $nin: ["cancelled","completed"] } // exclude cancelled so they free seats
      }
    },
    {
      $group: {
        _id: null,
        totalBooked: { $sum: "$groupSize" }
      }
    }
  ]);

  return agg[0]?.totalBooked ?? 0;
}
import Booking from "../models/Booking.model.js"
export const autoCompleteBookings = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of current day

  // condition: stayDate < (today - 0 days)
  // Means: if stayDate was yesterday or earlier, mark as completed
  const result = await Booking.updateMany(
    {
      status: { $in: ["pending", "confirmed"] },
      stayDate: { $lt: today }, // stayDate < today means stayDate ended yesterday or earlier
    },
    { $set: { status: "completed" } }
  );

  return result;
};


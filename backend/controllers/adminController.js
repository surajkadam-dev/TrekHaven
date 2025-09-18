import Accommodation from '../models/Admin.model.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import { User } from '../models/User.model.js';
import Booking from '../models/Booking.model.js';
import Testimonial from '../models/Testimonial.model.js';
import Payment from '../models/Payment.model.js';
import RefundRequest from '../models/RefundRequest.model.js';
import mongoose from 'mongoose';

export const createAccommodation = async (req, res, next) => {
  try {
    const {  maxMembers, vegRate, nonVegRate, pricePerNight } = req.body;
    // Simple validation
  if (!maxMembers || !vegRate || !nonVegRate || !pricePerNight) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const accommodation = await Accommodation.create({
      maxMembers,
      vegRate,
      nonVegRate,
      pricePerNight,
    });

    res.status(201).json({ success: true, data: accommodation });
  } catch (error) {
    next(error);
  }
};

export const getAccommodation = async (req, res, next) => {
  try {
    // Use await + lean() to get plain JS objects
    const data = await Accommodation.find({})

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: "Data not found"
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data
    });

  } catch (error) {
    console.error("Error fetching empty docs:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const updateAccommodation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { maxMembers, vegRate, nonVegRate, pricePerNight } = req.body;
  console.log(req.body);

  // Validate id
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid accommodation id.' });
  }

  // Make sure there's at least one field to update
  if (
    typeof maxMembers === 'undefined' &&
    typeof vegRate === 'undefined' &&
    typeof nonVegRate === 'undefined' &&
    typeof pricePerNight === 'undefined'
  ) {
    return res.status(400).json({ success: false, error: 'At least one field must be provided to update.' });
  }

  // Build updates object only from provided fields, with basic validation
  const updates = {};

  if (typeof maxMembers !== 'undefined') {
    const parsed = Number(maxMembers);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return res.status(400).json({ success: false, error: 'maxMembers must be a positive integer.' });
    }
    updates.maxMembers = parsed;
  }

  if (typeof vegRate !== 'undefined') {
    const parsed = Number(vegRate);
    if (Number.isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ success: false, error: 'vegRate must be a non-negative number.' });
    }
    updates.vegRate = parsed;
  }

  if (typeof nonVegRate !== 'undefined') {
    const parsed = Number(nonVegRate);
    if (Number.isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ success: false, error: 'nonVegRate must be a non-negative number.' });
    }
    updates.nonVegRate = parsed;
  }

  if (typeof pricePerNight !== 'undefined') {
    const parsed = Number(pricePerNight);
    if (Number.isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ success: false, error: 'pricePerNight must be a non-negative number.' });
    }
    updates.pricePerNight = parsed;
  }
const updatedAccommodation=await Accommodation.findById(id);
if(maxMembers < updatedAccommodation.bookedMembers){
  return res.status(400).json({ success: false, error: 'can not update less than booked members' });
}
  // Update document
  const accommodation = await Accommodation.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!accommodation) {
    return res.status(404).json({ success: false, error: 'Accommodation not found.' });
  }

  res.status(200).json({ success: true, data: accommodation,message:"Accommodation updated successfully." });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // Query params
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const keyword = req.query.keyword || "";
  const skip = (page - 1) * limit;

  // Search condition (case-insensitive regex)
  const searchQuery = keyword
    ? {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  // Get total count for pagination
  const totalUsers = await User.countDocuments(searchQuery);

  // Fetch users with filter + pagination
  const users = await User.find(searchQuery)
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // latest first

  res.status(200).json({
    success: true,
    page,
    limit,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});

export const getAllBookings = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10, keyword, status, groupName,paymentMode,mealType } = req.query;

  // Convert page & limit to numbers
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;

  // Filters
  const filter = { };

  filter["deletedBy.admin"] = { $ne: true };

  // Keyword search (on name/email)
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ];
  }

  // Status filter (confirmed / cancelled etc.)
  if (status) {
    filter.status = status;
  }

  // Group name filter
  if (groupName) {
    filter.groupName = { $regex: groupName, $options: "i" };
  }
  if (paymentMode) {
    filter.paymentMode = { $regex: paymentMode, $options: "i" };
  }
if(mealType)
{
  filter.mealType = { $regex: mealType, $options: "i" };
}
  // Count total documents for pagination
  const total = await Booking.countDocuments(filter);

  // Fetch bookings with pagination
  const bookings = await Booking.find(filter)
    .populate("user", "name email") // only select name & email from user
    .sort({ createdAt: -1,}) // latest first
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .lean();

  res.status(200).json({
    success: true,
    count: bookings.length,
    totalPages: Math.ceil(total / pageSize),
    currentPage: pageNumber,
    totalRecords: total,
    bookings,
  });
});


export const updatePaymentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
console.log(req.body);
  // Basic validations
  if (!paymentStatus || typeof paymentStatus !== 'string') {
    return res.status(400).json({ success: false, message: 'paymentStatus (string) is required.' });
  }

  // Auth: only admins allowed
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden. Admins only.' });
  }

  // Validate booking id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid booking id.' });

    
  }

  const booking=await Booking.findById(id);
  if(booking.status==='cancelled')
  {
    return res.status(200).json({
      success:false,
      error:"status cannot be updated for cancelled bookings."
    })
  }


  // Allowed target statuses (based on your schema enum)
  const normalizedNew = paymentStatus.trim().toLowerCase();
  const allowedTargets = ['paid', 'failed']; // you can extend this list if needed

  if (!allowedTargets.includes(normalizedNew)) {
    return res.status(400).json({
      success: false,
      message: `Invalid target paymentStatus. Allowed values: ${allowedTargets.join(', ')}.`,
    });
  }

  // Atomic update: only update when paymentMode is 'cash' and current paymentStatus is 'pending'
  const filter = {
    _id: id,
    paymentMode: 'cash',
    paymentStatus: 'pending',
  };

  const auditEntry = {
    admin: req.user._id,
    from: 'pending',
    to: normalizedNew,
    at: new Date(),
  };

  const update = {
    $set: {
      paymentStatus: normalizedNew,
      paymentUpdatedAt: new Date(),
      remainingAmount:0,
    },
    $push: {
      paymentUpdates: auditEntry, // recommend adding this to schema, otherwise Mongo will create it
    },
  };

  const options = { new: true };

  const updatedBooking = await Booking.findOneAndUpdate(filter, update, options);

  if (updatedBooking) {
    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully.',
      data: updatedBooking,
    });
  }

  // If update returned null, find reason (single extra read to give helpful error)
  const existing = await Booking.findById(id).lean();
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  // Determine why atomic update failed
  if ((existing.paymentMode || '').toLowerCase() !== 'cash') {
    return res.status(409).json({
      success: false,
      message: "Payment status can only be updated by admin when paymentMode is 'cash'.",
      current: { paymentMode: existing.paymentMode, paymentStatus: existing.paymentStatus },
    });
  }

  if ((existing.paymentStatus || '').toLowerCase() !== 'pending') {
    return res.status(409).json({
      success: false,
      message: "Payment status can only be updated when current paymentStatus is 'pending'.",
      current: { paymentMode: existing.paymentMode, paymentStatus: existing.paymentStatus },
    });
  }

  // Fallback (shouldn't reach here normally)
  return res.status(500).json({ success: false, message: 'Unable to update payment status.' });
});

export const blockUser = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isBlocked = true;
  await user.save();

  res.status(200).json({ success: true, message: "User blocked successfully" });
});
export const unblockUser = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isBlocked = false;
  await user.save();

  res.status(200).json({ success: true, message: "User unblocked successfully" });
});

export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  // Fetch user
  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  // Fetch related data
  const bookings = await Booking.find({ user: id }).sort({ createdAt: -1 }).lean();
  const reviews = await Testimonial.find({ user: id }).sort({ createdAt: -1 }).lean();
  const payments = await Payment.find({ user: id }).sort({ createdAt: -1 }).lean();
  const refunds = await RefundRequest.find({ user: id }).sort({ createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    data: {
      user,
      histories: {
        bookings,
        reviews,
        payments,
        refunds,
      },
    },
  });
});
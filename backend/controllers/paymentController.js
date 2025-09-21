import Payment from "../models/Payment.model.js";

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // assuming authentication middleware sets req.user

    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Optional filter by status
    const filter = { user: userId };
    if (status) filter.status = status;

    // Fetch payments without populate
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(limit))
      .select("amount status razorpayPaymentId razorpayOrderId method createdAt"); // only required fields

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      payments,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

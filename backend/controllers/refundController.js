


import RefundRequest from '../models/RefundRequest.model.js';




export const getRefundRequestStatus = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    // Find all refund requests for this user
    const refundRequests = await RefundRequest.find({ user: userId })
      .populate("booking payment")
      .sort({ createdAt: -1 }); // optional: latest first

    res.json({
      success: true,
      refundRequests
    });
  } catch (err) {
    console.error("getRefundRequestStatus error", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteRefundRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = String(req.user.role || "").toLowerCase();

    const refund = await RefundRequest.findById(id);
    if (!refund) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    // Status check
    if (["initiated", "processing"].includes(refund.status)) {
      return res.status(400).json({
        message: `Cannot delete refund request while status is '${refund.status}'.`,
      });
    }

    // Authorization check
    const isOwner = refund.user.toString() === userId.toString();
    if (userRole !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Unauthorized to delete this refund request" });
    }

    // Safe to delete
    await refund.deleteOne();

    return res.status(200).json({ message: "Refund request deleted successfully" });
  } catch (err) {
    console.error("Error deleting refund request:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllRefundRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, method, userId } = req.query;
    const role = String(req.user.role || "").toLowerCase();

    // base filter
    const filter = {};

    // if role is not admin, restrict to only the user's refunds
    if (role !== "admin") {
      filter.user = req.user._id;
    } else {
      // optional filter by userId (admin only)
      if (userId) filter.user = userId;
    }

    // optional filters
    if (status) filter.status = status;
    if (method) filter.method = method;

    // pagination
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    const [refunds, total] = await Promise.all([
      RefundRequest.find(filter)
        .populate("booking", "groupName stayDate") // select fields to populate
        .populate("user", "name email") // select fields to populate
        .populate("payment", "paymentId amount status")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      RefundRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: refunds,
    });
  } catch (err) {
    console.error("Error fetching refund requests:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

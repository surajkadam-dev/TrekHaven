


import RefundRequest from '../models/RefundRequest.model.js';




export const getRefundRequestStatus = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    // Find all refund requests for this user
    const refundRequests = await RefundRequest.find({ user: userId })
      .populate("booking payment")
      .sort({ createdAt: -1 }); // optional: latest first

    if (!refundRequests || refundRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No refund requests found"
      });
    }

    res.json({
      success: true,
      refundRequests
    });
  } catch (err) {
    console.error("getRefundRequestStatus error", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import express from "express";
import {User} from "../models/User.model.js";
import EmergencyUpdateRequest from "../models/EmergencyUpdateRequest.model.js";

import {sendEmail} from "../utils/emailService.js"
export const createEmergencyUpdateRequest = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user
    const { newEmail, newMobile, reason } = req.body;
    const user = await User.findById(userId);

    // At least one field must be provided
    if (!newEmail && !newMobile) {
      return res.status(400).json({ message: "Please provide new email or new mobile" });
    }

    if(user.provider === "google" && newEmail){
      return res.status(400).json({ message: "Email cannot be changed for Google-authenticated users" });
    }

    // Check if user exceeded 10 active requests
    const activeRequests = await EmergencyUpdateRequest.countDocuments({
      user: userId,
      status: "pending",
    });
    if (activeRequests >= 10) {
      return res
        .status(400)
        .json({ message: "You have reached the maximum number of pending requests (10)" });
    }

    // Check if newEmail already exists
    if (newEmail) {
      const existingEmailUser = await User.findOne({ email: newEmail });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Check if newMobile already exists
    if (newMobile) {
      const existingMobileUser = await User.findOne({ mobile: newMobile });
      if (existingMobileUser) {
        return res.status(400).json({ message: "Mobile already in use" });
      }
    }

    // Create the emergency update request
    const request = await EmergencyUpdateRequest.create({
      user: userId,
      newEmail: newEmail || null,
      newMobile: newMobile || null,
      reason,
    });

await sendEmail({
  to: process.env.SENDER_EMAIL,
  subject: "🚨 New Emergency Update Request - Action Required",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Update Request</title>
</head>
<body>
    <div>
        <div>
            <!-- Header -->
            <div style="background: #2d6a4f; padding: 25px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">⚠️ Emergency Update Request</h1>
                <p style="color: #d8f3dc; margin: 8px 0 0 0;">Immediate Admin Action Required</p>
            </div>

            <!-- Content -->
            <div style="padding: 25px 20px;">
                <!-- Alert Banner -->
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 20px;">
                    <p style="color: #856404; margin: 0;">New emergency update request requires your review</p>
                </div>

                <!-- User Information -->
                <div style="background: #f8f9fa; padding: 18px; margin-bottom: 20px;">
                    <h3 style="color: #2d6a4f; margin: 0 0 15px 0;">User Details</h3>
                    <div>
                        <p style="margin: 0; font-weight: bold;">${user.name || 'User'}</p>
                        <p style="margin: 4px 0 0 0; color: #6c757d;">${user.email}</p>
                    </div>
                </div>

                <!-- Requested Changes -->
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2d6a4f; margin: 0 0 15px 0;">Requested Changes</h3>
                    
                    ${request.newEmail ? `
                    <div style="background: #e8f5e8; border: 1px solid #b7efb7; padding: 15px; margin-bottom: 12px;">
                        <h4 style="color: #2d6a4f; margin: 0 0 10px 0;">📧 Email Update</h4>
                        <div>
                            <p style="margin: 5px 0;"><strong>Current:</strong> ${user.email}</p>
                            <p style="margin: 5px 0;"><strong>Requested:</strong> ${request.newEmail}</p>
                        </div>
                    </div>
                    ` : ''}

                    ${request.newMobile ? `
                    <div style="background: #e8f5e8; border: 1px solid #b7efb7; padding: 15px; margin-bottom: 12px;">
                        <h4 style="color: #2d6a4f; margin: 0 0 10px 0;">📱 Mobile Update</h4>
                        <div>
                            <p style="margin: 5px 0;"><strong>Current:</strong> ${user.mobile || 'Not set'}</p>
                            <p style="margin: 5px 0;"><strong>Requested:</strong> ${request.newMobile}</p>
                        </div>
                    </div>
                    ` : ''}

                    ${!request.newEmail && !request.newMobile ? `
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; text-align: center;">
                        <p style="color: #856404; margin: 0;">No specific changes requested - review required for reason provided.</p>
                    </div>
                    ` : ''}
                </div>

                <!-- Reason -->
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 18px; margin-bottom: 20px;">
                    <h3 style="color: #856404; margin: 0 0 12px 0;">📝 Reason for Update</h3>
                    <p style="color: #856404; margin: 0;">${request.reason}</p>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #e9ecef; padding-top: 20px; text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #6c757d;">This is an automated notification. Please do not reply to this email.</p>
                    <p style="margin: 0 0 8px 0; color: #2d6a4f; font-weight: bold;">Karpewadi Homestay Management System</p>
                    <p style="margin: 0; color: #6c757d; font-size: 12px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
        </div>

        <!-- Security Notice -->
        <div style="text-align: center; margin-top: 15px;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">🔒 This email contains sensitive information. Please handle with care.</p>
        </div>
    </div>
</body>
</html>
  `
});

    res.status(201).json({
      message: "Emergency update request submitted successfully",
      request,
    });
  } catch (err) {
    console.error("Error creating emergency update request:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List requests for admin with limit & filter
export const listEmergencyRequests = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const requests = await EmergencyUpdateRequest.find(filter)
      .sort({ requestedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("user", "name email mobile provider")
      .populate("reviewedBy", "name email");



    const total = await EmergencyUpdateRequest.countDocuments(filter);

    return res.status(200).json({ total, requests });
  } catch (err) {
    console.error("listEmergencyRequests error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Approve or reject emergency update request (admin)
export const handleEmergencyUpdate = async (req, res) => {
  try {
    const { id:requestId} = req.params;
    const { status, } = req.body; // status: approved | rejected
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
  

    const request = await EmergencyUpdateRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    const user = await User.findById(request.user);

    if (status === "approved") {
      // Only update email if provider is not google
      if (request.newEmail && user.provider !== "google") {
        user.email = request.newEmail;
        user.lastUpdateEmail = new Date();
      }
      // Always update mobile if requested
      if (request.newMobile) {
        user.mobile = request.newMobile;
        user.lastUpdateMobile = new Date();
      }
      await user.save();
    }

    await request.save();
    return res.status(200).json({ message: `Request ${status} successfully`, request });
  } catch (err) {
    console.error("handleEmergencyUpdate error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a request (admin)
export const deleteEmergencyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await EmergencyUpdateRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.deleteOne();
    return res.status(200).json({ message: "Request deleted" });
  } catch (err) {
    console.error("deleteEmergencyRequest error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// List user's own requests
export const listOwnEmergencyRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await EmergencyUpdateRequest.find({ user: userId }).sort({ requestedAt: -1 });
    return res.status(200).json({ requests });
  } catch (err) {
    console.error("listOwnEmergencyRequests error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
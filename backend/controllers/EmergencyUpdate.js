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

//     await sendEmail({
//   to:process.env.SENDER_EMAIL,
//   subject: "🚨 New Emergency Update Request - Action Required",
//   html: `
//  <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Emergency Update Request</title>
//     <style>
//         /* Reset Styles */
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
        
//         body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             background-color: #f5f7fa;
//             padding: 0;
//             margin: 0;
//             line-height: 1.5;
//             color: #333;
//             -webkit-text-size-adjust: 100%;
//         }
        
//         /* Main Container */
//         .email-wrapper {
//             max-width: 100%;
//             width: 100%;
//             margin: 0 auto;
//             background-color: #f5f7fa;
//             padding: 10px;
//         }
        
//         .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             background: #ffffff;
//             border-radius: 10px;
//             overflow: hidden;
//             box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
//         }
        
//         /* Header */
//         .header {
//             background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);
//             padding: 25px 20px;
//             text-align: center;
//         }
        
//         .header h1 {
//             color: #ffffff;
//             margin: 0;
//             font-size: 22px;
//             font-weight: 600;
//             line-height: 1.3;
//         }
        
//         .header p {
//             color: #d8f3dc;
//             margin: 8px 0 0 0;
//             font-size: 14px;
//         }
        
//         /* Content */
//         .content {
//             padding: 25px 20px;
//         }
        
//         /* Alert Banner */
//         .alert-banner {
//             background: #fff3cd;
//             border: 1px solid #ffeaa7;
//             border-radius: 8px;
//             padding: 15px;
//             margin-bottom: 20px;
//         }
        
//         .alert-content {
//             display: flex;
//             align-items: flex-start;
//         }
        
//         .alert-icon {
//             background: #fdcb6e;
//             border-radius: 50%;
//             width: 24px;
//             height: 24px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             flex-shrink: 0;
//             margin-right: 12px;
//         }
        
//         .alert-icon span {
//             color: #ffffff;
//             font-size: 14px;
//             font-weight: bold;
//         }
        
//         .alert-text {
//             margin: 0;
//             color: #856404;
//             font-weight: 500;
//             font-size: 15px;
//         }
        
//         /* User Information */
//         .user-info {
//             background: #f8f9fa;
//             border-radius: 8px;
//             padding: 18px;
//             margin-bottom: 20px;
//         }
        
//         .user-info h3 {
//             color: #2d6a4f;
//             margin: 0 0 15px 0;
//             font-size: 18px;
//             font-weight: 600;
//         }
        
//         .user-details {
//             display: flex;
//             align-items: center;
//         }
        
//         .user-avatar {
//             background: #2d6a4f;
//             color: #ffffff;
//             border-radius: 50%;
//             width: 45px;
//             height: 45px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: 600;
//             flex-shrink: 0;
//             margin-right: 15px;
//             font-size: 18px;
//         }
        
//         .user-text p {
//             margin: 0;
//         }
        
//         .user-name {
//             color: #212529;
//             font-weight: 600;
//             font-size: 16px;
//         }
        
//         .user-email {
//             color: #6c757d;
//             font-size: 14px;
//             margin-top: 4px;
//         }
        
//         /* Requested Changes */
//         .changes-section {
//             margin-bottom: 20px;
//         }
        
//         .changes-section h3 {
//             color: #2d6a4f;
//             margin: 0 0 15px 0;
//             font-size: 18px;
//             font-weight: 600;
//         }
        
//         .change-item {
//             background: #e8f5e8;
//             border: 1px solid #b7efb7;
//             border-radius: 8px;
//             padding: 15px;
//             margin-bottom: 12px;
//         }
        
//         .change-header {
//             display: flex;
//             align-items: center;
//             margin-bottom: 12px;
//         }
        
//         .change-icon {
//             color: #2d6a4f;
//             font-size: 18px;
//             margin-right: 8px;
//         }
        
//         .change-title {
//             color: #2d6a4f;
//             font-weight: 600;
//             font-size: 16px;
//         }
        
//         .change-comparison {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//         }
        
//         .change-row {
//             display: flex;
//             justify-content: space-between;
//         }
        
//         .change-label {
//             color: #6c757d;
//             font-size: 13px;
//         }
        
//         .change-value {
//             color: #495057;
//             font-weight: 500;
//         }
        
//         .change-new-value {
//             color: #2d6a4f;
//             font-weight: 600;
//         }
        
//         .no-changes {
//             background: #fff3cd;
//             border: 1px solid #ffeaa7;
//             border-radius: 8px;
//             padding: 15px;
//             text-align: center;
//         }
        
//         .no-changes p {
//             margin: 0;
//             color: #856404;
//             font-size: 15px;
//         }
        
//         /* Reason */
//         .reason-section {
//             background: #fff3cd;
//             border: 1px solid #ffeaa7;
//             border-radius: 8px;
//             padding: 18px;
//             margin-bottom: 20px;
//         }
        
//         .reason-section h3 {
//             color: #856404;
//             margin: 0 0 12px 0;
//             font-size: 16px;
//             font-weight: 600;
//             display: flex;
//             align-items: center;
//         }
        
//         .reason-section h3:before {
//             content: "📝";
//             margin-right: 8px;
//         }
        
//         .reason-text {
//             margin: 0;
//             color: #856404;
//             font-size: 14px;
//             line-height: 1.5;
//         }
        
//         /* Footer */
//         .footer {
//             border-top: 1px solid #e9ecef;
//             padding-top: 20px;
//             text-align: center;
//         }
        
//         .footer p {
//             margin: 0 0 8px 0;
//             color: #6c757d;
//             font-size: 14px;
//         }
        
//         .system-name {
//             color: #2d6a4f;
//             font-size: 14px;
//             font-weight: 600;
//         }
        
//         .date {
//             color: #6c757d;
//             font-size: 12px;
//             margin-top: 4px;
//         }
        
//         /* Security Notice */
//         .security-notice {
//             max-width: 600px;
//             margin: 15px auto;
//             text-align: center;
//             padding: 0 10px;
//         }
        
//         .security-notice p {
//             margin: 0;
//             color: #6c757d;
//             font-size: 12px;
//         }
        
//         /* Desktop Styles */
//         @media only screen and (min-width: 600px) {
//             .email-wrapper {
//                 padding: 20px 10px;
//             }
            
//             .content {
//                 padding: 30px;
//             }
            
//             .header {
//                 padding: 30px;
//             }
            
//             .header h1 {
//                 font-size: 24px;
//             }
            
//             .change-comparison {
//                 flex-direction: row;
//                 align-items: center;
//                 justify-content: space-between;
//             }
            
//             .change-row {
//                 flex: 1;
//                 flex-direction: column;
//             }
            
//             .change-arrow {
//                 color: #6c757d;
//                 font-size: 18px;
//                 padding: 0 15px;
//             }
            
//             .change-comparison.desktop-layout {
//                 flex-direction: row;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="email-wrapper">
//         <div class="email-container">
//             <!-- Header -->
//             <div class="header">
//                 <h1>⚠️ Emergency Update Request</h1>
//                 <p>Immediate Admin Action Required</p>
//             </div>

//             <!-- Content -->
//             <div class="content">
//                 <!-- Alert Banner -->
//                 <div class="alert-banner">
//                     <div class="alert-content">
//                         <div class="alert-icon">
//                             <span>!</span>
//                         </div>
//                         <p class="alert-text">New emergency update request requires your review</p>
//                     </div>
//                 </div>

//                 <!-- User Information -->
//                 <div class="user-info">
//                     <h3>User Details</h3>
//                     <div class="user-details">
//                         <div class="user-avatar">
//                             ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
//                         </div>
//                         <div class="user-text">
//                             <p class="user-name">${user.name || 'User'}</p>
//                             <p class="user-email">${user.email}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <!-- Requested Changes -->
//                 <div class="changes-section">
//                     <h3>Requested Changes</h3>
                    
//                     ${request.newEmail ? `
//                     <div class="change-item">
//                         <div class="change-header">
//                             <span class="change-icon">📧</span>
//                             <span class="change-title">Email Update</span>
//                         </div>
//                         <div class="change-comparison mobile-layout">
//                             <div class="change-row">
//                                 <div class="change-label">Current</div>
//                                 <div class="change-value">${user.email}</div>
//                             </div>
//                             <div class="change-row">
//                                 <div class="change-label">Requested</div>
//                                 <div class="change-new-value">${request.newEmail}</div>
//                             </div>
//                         </div>
//                     </div>
//                     ` : ''}

//                     ${request.newMobile ? `
//                     <div class="change-item">
//                         <div class="change-header">
//                             <span class="change-icon">📱</span>
//                             <span class="change-title">Mobile Update</span>
//                         </div>
//                         <div class="change-comparison mobile-layout">
//                             <div class="change-row">
//                                 <div class="change-label">Current</div>
//                                 <div class="change-value">${user.mobile || 'Not set'}</div>
//                             </div>
//                             <div class="change-row">
//                                 <div class="change-label">Requested</div>
//                                 <div class="change-new-value">${request.newMobile}</div>
//                             </div>
//                         </div>
//                     </div>
//                     ` : ''}

//                     ${!request.newEmail && !request.newMobile ? `
//                     <div class="no-changes">
//                         <p>No specific changes requested - review required for reason provided.</p>
//                     </div>
//                     ` : ''}
//                 </div>

//                 <!-- Reason -->
//                 <div class="reason-section">
//                     <h3>Reason for Update</h3>
//                     <p class="reason-text">${request.reason}</p>
//                 </div>

//                 <!-- Footer -->
//                 <div class="footer">
//                     <p>This is an automated notification. Please do not reply to this email.</p>
//                     <p class="system-name">Karpewadi Homestay Management System</p>
//                     <p class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
//                 </div>
//             </div>
//         </div>

//         <!-- Security Notice -->
//         <div class="security-notice">
//             <p>🔒 This email contains sensitive information. Please handle with care and ensure proper authorization for any actions taken.</p>
//         </div>
//     </div>

//     <script>
//         // This script enhances the layout for desktop view
//         document.addEventListener('DOMContentLoaded', function() {
//             if (window.innerWidth > 600) {
//                 // Convert mobile layout to desktop layout for change items
//                 const changeItems = document.querySelectorAll('.change-item');
//                 changeItems.forEach(item => {
//                     const comparison = item.querySelector('.change-comparison');
//                     if (comparison) {
//                         comparison.classList.remove('mobile-layout');
//                         comparison.classList.add('desktop-layout');
                        
//                         const rows = comparison.querySelectorAll('.change-row');
//                         if (rows.length === 2) {
//                             const arrow = document.createElement('div');
//                             arrow.className = 'change-arrow';
//                             arrow.innerHTML = '→';
                            
//                             comparison.insertBefore(arrow, rows[1]);
//                         }
//                     }
//                 });
//             }
//         });
//     </script>
// </body>
// </html>
//   `
// });

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
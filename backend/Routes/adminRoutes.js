import express from 'express';
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createAccommodation,
  getAccommodation,
  getAllUsers,
  getAllBookings,
  updatePaymentStatus,
  updateAccommodation,
  getUserDetails,
  blockUser,
  unblockUser,
  getBookingsByDate
  ,getBookingSummary
} from '../controllers/adminController.js';
import { adminProcessRefund } from '../controllers/bookingController.js';

import {getAllRefundRequests} from "../controllers/refundController.js";




const router = express.Router();

router.post('/accommodation', isAuthenticated, isAuthorized('admin'), createAccommodation);
router.get('/accommodation',getAccommodation);
router.get('/users', isAuthenticated,isAuthorized('admin'), getAllUsers);
router.get("/all-refunds",isAuthenticated,isAuthorized("admin"),getAllRefundRequests);
router.get('/All-bookings', isAuthenticated, isAuthorized('admin'), getAllBookings);
router.put("/:id/paymentsatus-update",isAuthenticated,isAuthorized('admin'),updatePaymentStatus);
router.put("/accommodation/:id", isAuthenticated, isAuthorized('admin'), updateAccommodation);
router.post("/:refundId/process",isAuthenticated,isAuthorized('admin'),adminProcessRefund);
router.get("/:id/user/detail",isAuthenticated,isAuthorized("admin"),getUserDetails);
router.put("/:id/block/user",isAuthenticated,isAuthorized("admin"),blockUser);
router.put("/:id/unblock/user",isAuthenticated,isAuthorized("admin"),unblockUser);
router.get("/booked-members",isAuthenticated,isAuthorized("admin"),getBookingsByDate);
router.get("/summary",isAuthenticated,isAuthorized("admin"),getBookingSummary);

export default router;

import express from 'express';
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createBookingOrder,getMyBookings,cancelThenAutoRefund,getBookingById ,deleteBooking,verifyPayment,getRefundStatus,checkBookingConfirmation } from '../controllers/bookingController.js';

const router =express.Router();
router.post('/:accommodationId', isAuthenticated, isAuthorized('trekker'), createBookingOrder);
router.post('/:accommodationId/verify-payment', isAuthenticated, isAuthorized('trekker'), verifyPayment);
router.get('/my-bookings',isAuthenticated,isAuthorized('trekker'),getMyBookings);

router.put('/cancel-booking/:id', isAuthenticated, isAuthorized('trekker'),cancelThenAutoRefund);
router.put("/delete-booking/:id", isAuthenticated,deleteBooking);
router.get("/refund-status/:id", isAuthenticated, isAuthorized('trekker'),getRefundStatus);
router.get('/check-confirmation/:orderId', isAuthenticated, isAuthorized('trekker'),checkBookingConfirmation);
router.get("/:id/booking/details",isAuthenticated,isAuthorized("admin"),getBookingById);

export default router;

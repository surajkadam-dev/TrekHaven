import express from 'express';
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createAccommodation,getAccommodation,getAllUsers,getAllBookings,updatePaymentStatus,updateAccommodation} from '../controllers/adminController.js';
import { adminProcessRefund } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/accommodation', isAuthenticated, isAuthorized('admin'), createAccommodation);
router.get('/accommodation',isAuthenticated,getAccommodation);
router.get('/users', isAuthenticated,isAuthorized('admin'), getAllUsers);
router.get('/All-bookings', isAuthenticated, isAuthorized('admin'), getAllBookings);
router.put("/:id/paymentsatus-update",isAuthenticated,isAuthorized('admin'),updatePaymentStatus);
router.put("/accommodation/:id", isAuthenticated, isAuthorized('admin'), updateAccommodation);
router.post("/:refundId/process",isAuthenticated,isAuthorized('admin'),adminProcessRefund);

export default router;

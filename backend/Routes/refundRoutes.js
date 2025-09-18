import express from 'express';
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import {getRefundRequestStatus,deleteRefundRequest,getAllRefundRequests} from "../controllers/refundController.js";

const router = express.Router();

router.get("/my-refunds", isAuthenticated,getRefundRequestStatus);
router.delete("/my-refunds/:id", isAuthenticated, deleteRefundRequest);

export default router;

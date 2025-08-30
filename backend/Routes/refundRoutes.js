import express from 'express';
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import {getRefundRequestStatus} from "../controllers/refundController.js";

const router = express.Router();

router.get("/my-refunds", isAuthenticated,getRefundRequestStatus);

export default router;

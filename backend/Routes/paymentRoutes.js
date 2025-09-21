import express from 'express';
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import {getUserTransactions} from "../controllers/paymentController.js"

const router = express.Router();

router.get("/transactions",isAuthenticated,getUserTransactions);


export default router;
import express from "express";
import { isAuthenticated,isAuthorized} from "../middleware/auth.js";
import {createEmergencyUpdateRequest,listEmergencyRequests,listOwnEmergencyRequests,handleEmergencyUpdate,deleteEmergencyRequest} from "../controllers/EmergencyUpdate.js"

const router = express.Router();

router.post("/create", isAuthenticated, createEmergencyUpdateRequest);
router.get("/list", isAuthenticated, isAuthorized("admin"), listEmergencyRequests);
router.get("/list/own", isAuthenticated, listOwnEmergencyRequests);
router.put("/handle/:id/status", isAuthenticated, isAuthorized("admin"), handleEmergencyUpdate);
router.delete("/delete/:requestId", isAuthenticated, isAuthorized("admin"), deleteEmergencyRequest);

export default router;

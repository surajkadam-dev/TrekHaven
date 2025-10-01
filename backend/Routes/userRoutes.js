import express from 'express';
import { register,login,logout,getUser,updatePassword,updateProfile,googleAuth,checkMobile,handleContactFormSubmit,forgotPassword,resetPassword,verifyResetToken} from '../controllers/userController.js'; 
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
const router =express.Router();
router.post('/register',register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/auth/google",googleAuth);
router.get("/check-mobile",checkMobile);
router.post("/forgot-password",forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);


router.get("/get-me",isAuthenticated,getUser);
router.put("/update-password",isAuthenticated,updatePassword);
router.put("/update-profile",isAuthenticated,updateProfile);
router.post("/send/contact-form",handleContactFormSubmit);


export default router;
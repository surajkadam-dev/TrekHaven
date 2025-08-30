import express from 'express';
import {isAuthenticated,isAuthorized} from "../middleware/auth.js";
import {addTestimonial,getAllTestimonials,getMyReview,deleteReview,updateReviewStatus} from "../controllers/TestimonialController.js";

const router= express.Router();
router.post("/add-testimonial",isAuthenticated,isAuthorized("trekker"), addTestimonial);
router.get("/all-reviews", getAllTestimonials);
router.get("/my-reviews", isAuthenticated, getMyReview);
router.delete("/delete-review/:reviewId", isAuthenticated, deleteReview);
router.put("/update-review-status/:reviewId", isAuthenticated, isAuthorized("admin"), updateReviewStatus);

export default router;
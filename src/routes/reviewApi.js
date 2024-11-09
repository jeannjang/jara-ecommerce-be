import express from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
} from "../controller/reviewController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/create/:productId", authenticate, createReview);
router.get("/get/:productId", getProductReviews);
router.delete("/delete/:reviewId", authenticate, deleteReview);

export default router;

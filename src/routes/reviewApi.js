import express from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
} from "../controller/reviewController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/:productId", authenticate, createReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", authenticate, deleteReview);

export default router;

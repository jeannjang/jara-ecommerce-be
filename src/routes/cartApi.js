import express from "express";
import { addItemToCart } from "../controller/cartController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, addItemToCart);

export default router;

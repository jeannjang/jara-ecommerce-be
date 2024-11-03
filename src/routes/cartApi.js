import express from "express";
import { addItemToCart, getCartItems } from "../controller/cartController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, addItemToCart);
router.get("/", authenticate, getCartItems);

export default router;

import express from "express";
import { createOrder } from "../controller/orderController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);

export default router;

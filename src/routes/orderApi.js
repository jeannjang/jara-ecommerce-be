import express from "express";
import {
  createOrder,
  getOrder,
  getOrderList,
} from "../controller/orderController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrder);
router.get("/list", authenticate, getOrderList);

export default router;

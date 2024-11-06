import express from "express";
import {
  createOrder,
  getOrder,
  getOrderList,
  updateOrder,
} from "../controller/orderController.js";
import {
  authenticate,
  checkAdminPermission,
} from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrder);
router.get("/list", authenticate, getOrderList);
router.put("/:id", authenticate, checkAdminPermission, updateOrder);

export default router;

import express from "express";
import { createProduct } from "../controller/productController.js";
import {
  authenticate,
  checkAdminPermission,
} from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, checkAdminPermission, createProduct);

export default router;

import express from "express";
import { createProduct, getProducts } from "../controller/productController.js";
import {
  authenticate,
  checkAdminPermission,
} from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, checkAdminPermission, createProduct);
router.get("/", getProducts); //admin이 아닌 사용자도 볼 수 있어야 함 (전체 상품 목록 조회)

export default router;

import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import {
  authenticate,
  checkAdminPermission,
} from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, checkAdminPermission, createProduct);
router.get("/", getProducts); //admin, customer 모두의 상품 목록 조회
router.put("/:id", authenticate, checkAdminPermission, updateProduct);
router.delete("/:id", authenticate, checkAdminPermission, deleteProduct);

export default router;

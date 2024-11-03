import express from "express";
import {
  addItemToCart,
  getCartItems,
  updateCartItemQty,
  deleteCartItem,
  getCartItemCount,
} from "../controller/cartController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, addItemToCart);
router.get("/", authenticate, getCartItems);
router.get("/count", authenticate, getCartItemCount);
router.put("/:itemId", authenticate, updateCartItemQty);
router.delete("/:itemId", authenticate, deleteCartItem);
export default router;

import express from "express";
import {
  addItemToCart,
  getCartItems,
  deleteCartItem,
} from "../controller/cartController.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.post("/", authenticate, addItemToCart);
router.get("/", authenticate, getCartItems);
router.delete("/:itemId", authenticate, deleteCartItem);
export default router;

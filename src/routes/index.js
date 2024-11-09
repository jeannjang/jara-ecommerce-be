import express from "express";
import userApi from "./userApi.js";
import authApi from "./authApi.js";
import productApi from "./productApi.js";
import cartApi from "./cartApi.js";
import orderApi from "./orderApi.js";
import reviewApi from "./reviewApi.js";

const router = express.Router();

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);
router.use("/cart", cartApi);
router.use("/order", orderApi);
router.use("/reviews", reviewApi);

export default router;

import express from "express";
import { createUser } from "../controller/userController.js";
import { getUser } from "../controller/userController.js";
import { authenticate } from "../controller/authController.js";

export const router = express.Router();

router.post("/", createUser);
router.get("/me", authenticate, getUser);

export default router;

import express from "express";
import { loginWithEmail } from "../controller/authController.js";

const router = express.Router();

router.post("/login", loginWithEmail);

export default router;

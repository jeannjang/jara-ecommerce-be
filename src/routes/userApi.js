import express from "express";
import { createUser } from "../controller/userController.js";

export const router = express.Router();

router.post("/", createUser);

export default router;

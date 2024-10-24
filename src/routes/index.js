import express from "express";
import userApi from "./userApi.js";

const router = express.Router();

router.use("/user", userApi);
// router.use();

export default router;

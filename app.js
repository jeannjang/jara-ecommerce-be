import express, { json } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import indexRouter from "./src/routes/index.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", indexRouter);

dotenv.config();

const PORT = process.env.PORT || 5010;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoURI = process.env.DB_URI;
console.log(mongoURI);

mongoose
  .connect(mongoURI)
  .then(() => console.log("connected to mongoose database"))
  .catch((err) => console.error("Failed to connect to database", err));

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error. Please try again later.",
  });
});

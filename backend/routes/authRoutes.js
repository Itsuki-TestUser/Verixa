import express from "express";
import {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per `window` (here, per hour)
  message:
    "Too many reset requests from this IP, please try again after an hour",
});

router.post("/signup", authLimiter, registerUser);
router.post("/login", authLimiter, authUser);
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordLimiter,
  forgotPassword,
);
router.post("/reset-password", resetPassword);

export default router;

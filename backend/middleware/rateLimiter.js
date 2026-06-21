import rateLimit from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Query limiter
export const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: "Query limit reached. Please slow down." },
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Upload limit reached. Please try again later." },
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
});

// Workspace creation limiter
export const workspaceLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: { message: "Workspace creation limit reached for today." },
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json({ message: "Workspace creation limit reached for today." });
  },
});

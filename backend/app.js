import express from "express";
import cors from "cors";
import documentRoutes from "./routes/documentRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
const app = express();
app.use(cors());
app.use("/api", apiLimiter);
app.use(express.json());
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/chat", chatRoutes); // Ensure chat routes are registered before auth routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes); // Frontend expects /api/documents
app.use("/api/query", queryRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;

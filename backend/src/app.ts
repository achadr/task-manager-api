import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { SQLiteTaskRepository } from "./infrastructure/repositories/SQLiteTaskRepository";
import { TaskService } from "./application/services/TaskService";
import { TaskController } from "./presentation/controllers/TaskController";
import { createTaskRoutes } from "./presentation/routes/taskRoutes";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import { requestId } from "./presentation/middlewares/requestId";
import logger from "./infrastructure/logging/Logger";

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Request ID middleware
  app.use(requestId);

  // Middleware to parse JSON with size limit
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging with timing and correlation
  app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info("Request completed", {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });
    });

    logger.info("Request received", {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
    });

    next();
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // Dependency Injection
  const taskRepository = new SQLiteTaskRepository();
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  // Routes
  app.use("/tasks", createTaskRoutes(taskController));

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
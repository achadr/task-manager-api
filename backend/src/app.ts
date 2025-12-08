import express from "express";
import { SQLiteTaskRepository } from "./infrastructure/repositories/SQLiteTaskRepository";
import { TaskService } from "./application/services/TaskService";
import { TaskController } from "./presentation/controllers/TaskController";
import { createTaskRoutes } from "./presentation/routes/taskRoutes";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import logger from "./infrastructure/logging/Logger";

export function createApp() {
  const app = express();

  // Middleware to parse JSON
  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
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
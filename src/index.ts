import express from "express";
import { SQLiteTaskRepository } from "./infrastructure/repositories/SQLiteTaskRepository";
import { TaskService } from "./application/services/TaskService";
import { TaskController } from "./presentation/controllers/TaskController";
import { createTaskRoutes } from "./presentation/routes/taskRoutes";
import { errorHandler } from "./presentation/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Dependency Injection - wiring everything together
const taskRepository = new SQLiteTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

// Routes
app.use("/tasks", createTaskRoutes(taskController));

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
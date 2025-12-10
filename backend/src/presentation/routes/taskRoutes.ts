import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { validate } from "../middlewares/validate";
import { validateUUID } from "../middlewares/validateUUID";
import { createTaskSchema, updateTaskSchema } from "../validators/taskValidators";

export function createTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  router.get("/stats", (req, res, next) => taskController.getStats(req, res, next));
  router.post("/", validate(createTaskSchema), (req, res, next) => taskController.create(req, res, next));
  router.get("/", (req, res, next) => taskController.getAll(req, res, next));
  router.get("/:id", validateUUID("id"), (req, res, next) => taskController.getById(req, res, next));
  router.put("/:id", validateUUID("id"), validate(updateTaskSchema), (req, res, next) => taskController.update(req, res, next));
  router.delete("/:id", validateUUID("id"), (req, res, next) => taskController.delete(req, res, next));

  return router;
}
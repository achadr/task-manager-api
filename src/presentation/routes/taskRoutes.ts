import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema } from "../validators/taskValidators";

export function createTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  router.post("/", validate(createTaskSchema), (req, res, next) => taskController.create(req, res, next));
  router.get("/", (req, res, next) => taskController.getAll(req, res, next));
  router.get("/:id", (req, res, next) => taskController.getById(req, res, next));
  router.put("/:id", validate(updateTaskSchema), (req, res, next) => taskController.update(req, res, next));
  router.delete("/:id", (req, res, next) => taskController.delete(req, res, next));

  return router;
}
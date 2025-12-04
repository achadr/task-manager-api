import { Request, Response, NextFunction } from "express";
import { TaskService } from "../../application/services/TaskService";
import { CreateTaskDTO, UpdateTaskDTO } from "../../application/dtos/TaskDTO";

export class TaskController {
  constructor(private taskService: TaskService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateTaskDTO = req.body;
      const task = await this.taskService.createTask(dto);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateTaskDTO = req.body;
      const task = await this.taskService.updateTask(id, dto);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
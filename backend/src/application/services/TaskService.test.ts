import { TaskService } from "./TaskService";
import { TaskRepository } from "../../domain/interfaces/TaskRepository";
import { Task, TaskStatus, TaskPriority } from "../../domain/entities/Task";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";

describe("TaskService", () => {
  let taskService: TaskService;
  let mockRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countByStatus: jest.fn(),
      countByPriority: jest.fn(),
    };
    taskService = new TaskService(mockRepository);
  });

  describe("createTask", () => {
    it("should create a task with default values", async () => {
      mockRepository.save.mockResolvedValue({} as Task);

      const result = await taskService.createTask({
        title: "New Task",
        description: "Task description",
      });

      expect(result.title).toBe("New Task");
      expect(result.status).toBe(TaskStatus.PENDING);
      expect(result.priority).toBe(TaskPriority.MEDIUM);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTaskById", () => {
    it("should return task if found", async () => {
      const task = new Task({
        id: "123",
        title: "Test",
        description: "Desc",
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockRepository.findById.mockResolvedValue(task);

      const result = await taskService.getTaskById("123");

      expect(result.id).toBe("123");
      expect(result.title).toBe("Test");
    });

    it("should throw TaskNotFoundError if not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(taskService.getTaskById("999")).rejects.toThrow(TaskNotFoundError);
    });
  });

  describe("deleteTask", () => {
    it("should delete task if found", async () => {
      const task = new Task({
        id: "123",
        title: "Test",
        description: "Desc",
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockRepository.findById.mockResolvedValue(task);
      mockRepository.delete.mockResolvedValue();

      await taskService.deleteTask("123");

      expect(mockRepository.delete).toHaveBeenCalledWith("123");
    });

    it("should throw TaskNotFoundError if task not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(taskService.deleteTask("999")).rejects.toThrow(TaskNotFoundError);
    });
  });
});
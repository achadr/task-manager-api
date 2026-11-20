import { TaskService } from "./TaskService";
import { TaskRepository } from "../../domain/interfaces/TaskRepository";
import { EventPublisher } from "../../domain/interfaces/EventPublisher";
import { Task, TaskStatus, TaskPriority } from "../../domain/entities/Task";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";

describe("TaskService", () => {
  let taskService: TaskService;
  let mockRepository: jest.Mocked<TaskRepository>;
  let mockPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByStatus: jest.fn(),
      countByPriority: jest.fn(),
      countOverdue: jest.fn(),
    };
    mockPublisher = { publish: jest.fn().mockResolvedValue(undefined) };
    taskService = new TaskService(mockRepository, mockPublisher);
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

    it("should publish task.created once the task is saved", async () => {
      mockRepository.save.mockResolvedValue({} as Task);

      const result = await taskService.createTask({ title: "Published", description: "Event test" });

      expect(mockPublisher.publish).toHaveBeenCalledTimes(1);
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        "task.created",
        expect.objectContaining({ id: result.id, title: "Published" })
      );
    });

    it("should not publish when saving fails", async () => {
      mockRepository.save.mockRejectedValue(new Error("db down"));

      await expect(taskService.createTask({ title: "Lost", description: "Event test" })).rejects.toThrow("db down");
      expect(mockPublisher.publish).not.toHaveBeenCalled();
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
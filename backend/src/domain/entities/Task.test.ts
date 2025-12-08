import { Task, TaskStatus, TaskPriority } from "./Task";

describe("Task", () => {
  const createTask = (overrides = {}) => {
    return new Task({
      id: "test-id",
      title: "Test Task",
      description: "Test Description",
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      dueDate: null,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
      ...overrides,
    });
  };

  describe("complete", () => {
    it("should mark task as completed", () => {
      const task = createTask();

      task.complete();

      expect(task.status).toBe(TaskStatus.COMPLETED);
    });

    it("should throw error if task is already completed", () => {
      const task = createTask({ status: TaskStatus.COMPLETED });

      expect(() => task.complete()).toThrow("Task is already completed");
    });
  });

  describe("isOverdue", () => {
    it("should return false if no due date", () => {
      const task = createTask({ dueDate: null });

      expect(task.isOverdue()).toBe(false);
    });

    it("should return false if task is completed", () => {
      const task = createTask({
        status: TaskStatus.COMPLETED,
        dueDate: new Date("2020-01-01"),
      });

      expect(task.isOverdue()).toBe(false);
    });

    it("should return true if due date is in the past", () => {
      const task = createTask({
        dueDate: new Date("2020-01-01"),
      });

      expect(task.isOverdue()).toBe(true);
    });

    it("should return false if due date is in the future", () => {
      const task = createTask({
        dueDate: new Date("2030-01-01"),
      });

      expect(task.isOverdue()).toBe(false);
    });
  });
});
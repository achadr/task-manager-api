export class TaskNotFoundError extends Error {
    constructor(taskId: string) {
      super(`Task with id "${taskId}" not found`);
      this.name = "TaskNotFoundError";
    }
  }
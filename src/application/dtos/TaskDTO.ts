import { TaskStatus, TaskPriority } from "../../domain/entities/Task";

// What we receive when creating a task
export interface CreateTaskDTO {
  title: string;
  description: string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

// What we receive when updating a task
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

// What we send back to the client
export interface TaskResponseDTO {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}
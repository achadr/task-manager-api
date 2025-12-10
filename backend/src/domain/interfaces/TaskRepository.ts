import { Task } from "../entities/Task";

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(options?: { limit?: number; offset?: number }): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  countByStatus(): Promise<Record<string, number>>;
  countByPriority(): Promise<Record<string, number>>;
  countOverdue(): Promise<number>;
}
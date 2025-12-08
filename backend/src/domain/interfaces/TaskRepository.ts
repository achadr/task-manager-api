import { Task } from "../entities/Task";

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  countByStatus(): Promise<Record<string, number>>;
  countByPriority(): Promise<Record<string, number>>;
}
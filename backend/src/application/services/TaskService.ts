import { Task, TaskStatus, TaskPriority } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/interfaces/TaskRepository";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from "../dtos/TaskDTO";
import { randomUUID } from "crypto";
import { TaskStatsDTO } from "../dtos/StatsDTO";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async createTask(dto: CreateTaskDTO): Promise<TaskResponseDTO> {
    const now = new Date();

    const task = new Task({
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: TaskStatus.PENDING,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      createdAt: now,
      updatedAt: now,
    });

    await this.taskRepository.save(task);

    return this.toResponseDTO(task);
  }

  async getTaskById(id: string): Promise<TaskResponseDTO> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    return this.toResponseDTO(task);
  }

  async getAllTasks(): Promise<TaskResponseDTO[]> {
    const tasks = await this.taskRepository.findAll();
    return tasks.map((task) => this.toResponseDTO(task));
  }

  async updateTask(id: string, dto: UpdateTaskDTO): Promise<TaskResponseDTO> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.dueDate !== undefined) {
      task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }
    task.updatedAt = new Date();

    await this.taskRepository.update(task);

    return this.toResponseDTO(task);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new TaskNotFoundError(id);
    }

    await this.taskRepository.delete(id);
  }
  async getStats(): Promise<TaskStatsDTO> {
    const tasks = await this.taskRepository.findAll();
    const byStatus = await this.taskRepository.countByStatus();
    const byPriority = await this.taskRepository.countByPriority();

    const overdue = tasks.filter((task) => task.isOverdue()).length;

    return {
      total: tasks.length,
      byStatus: {
        pending: byStatus.pending,
        in_progress: byStatus.in_progress,
        completed: byStatus.completed,
      },
      byPriority: {
        low: byPriority.low,
        medium: byPriority.medium,
        high: byPriority.high,
      },
      overdue,
    };
  }
  private toResponseDTO(task: Task): TaskResponseDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      isOverdue: task.isOverdue(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
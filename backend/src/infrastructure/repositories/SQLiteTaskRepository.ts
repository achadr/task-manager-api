import { Task, TaskProps, TaskStatus, TaskPriority } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/interfaces/TaskRepository";
import prisma from "../database/connection";

type PrismaTaskStatus = "pending" | "in_progress" | "completed";
type PrismaTaskPriority = "low" | "medium" | "high";

export class SQLiteTaskRepository implements TaskRepository {
  private isValidPrismaStatus(status: string): status is PrismaTaskStatus {
    return status === "pending" || status === "in_progress" || status === "completed";
  }

  private isValidPrismaPriority(priority: string): priority is PrismaTaskPriority {
    return priority === "low" || priority === "medium" || priority === "high";
  }

  private validateAndConvertStatus(status: string): PrismaTaskStatus {
    if (!this.isValidPrismaStatus(status)) {
      throw new Error(`Invalid task status: ${status}`);
    }
    return status;
  }

  private validateAndConvertPriority(priority: string): PrismaTaskPriority {
    if (!this.isValidPrismaPriority(priority)) {
      throw new Error(`Invalid task priority: ${priority}`);
    }
    return priority;
  }

  private toPrismaStatus(status: TaskStatus): PrismaTaskStatus {
    const statusMap: Record<TaskStatus, PrismaTaskStatus> = {
      [TaskStatus.PENDING]: "pending",
      [TaskStatus.IN_PROGRESS]: "in_progress",
      [TaskStatus.COMPLETED]: "completed",
    };
    return statusMap[status];
  }

  private toPrismaPriority(priority: TaskPriority): PrismaTaskPriority {
    const priorityMap: Record<TaskPriority, PrismaTaskPriority> = {
      [TaskPriority.LOW]: "low",
      [TaskPriority.MEDIUM]: "medium",
      [TaskPriority.HIGH]: "high",
    };
    return priorityMap[priority];
  }

  private toDomainStatus(status: PrismaTaskStatus): TaskStatus {
    const statusMap: Record<PrismaTaskStatus, TaskStatus> = {
      pending: TaskStatus.PENDING,
      in_progress: TaskStatus.IN_PROGRESS,
      completed: TaskStatus.COMPLETED,
    };
    return statusMap[status];
  }

  private toDomainPriority(priority: PrismaTaskPriority): TaskPriority {
    const priorityMap: Record<PrismaTaskPriority, TaskPriority> = {
      low: TaskPriority.LOW,
      medium: TaskPriority.MEDIUM,
      high: TaskPriority.HIGH,
    };
    return priorityMap[priority];
  }

  async save(task: Task): Promise<Task> {
    await prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: this.toPrismaStatus(task.status),
        priority: this.toPrismaPriority(task.priority),
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });

    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const taskRecord = await prisma.task.findUnique({
      where: { id },
    });

    if (!taskRecord) return null;

    return this.mapRecordToTask({
      ...taskRecord,
      status: this.validateAndConvertStatus(taskRecord.status),
      priority: this.validateAndConvertPriority(taskRecord.priority),
    });
  }

  async findAll(): Promise<Task[]> {
    const taskRecords = await prisma.task.findMany();

    return taskRecords.map((record) =>
      this.mapRecordToTask({
        ...record,
        status: this.validateAndConvertStatus(record.status),
        priority: this.validateAndConvertPriority(record.priority),
      })
    );
  }

  async update(task: Task): Promise<Task> {
    await prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: this.toPrismaStatus(task.status),
        priority: this.toPrismaPriority(task.priority),
        dueDate: task.dueDate,
        updatedAt: task.updatedAt,
      },
    });

    return task;
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  }

  async countByStatus(): Promise<Record<string, number>> {
    const statusCounts = await prisma.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const result: Record<string, number> = {
      pending: 0,
      in_progress: 0,
      completed: 0,
    };

    statusCounts.forEach((item) => {
      result[item.status] = item._count.status;
    });

    return result;
  }

  async countByPriority(): Promise<Record<string, number>> {
    const priorityCounts = await prisma.task.groupBy({
      by: ["priority"],
      _count: {
        priority: true,
      },
    });

    const result: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    priorityCounts.forEach((item) => {
      result[item.priority] = item._count.priority;
    });

    return result;
  }

  private mapRecordToTask(record: {
    id: string;
    title: string;
    description: string;
    status: PrismaTaskStatus;
    priority: PrismaTaskPriority;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
    const props: TaskProps = {
      id: record.id,
      title: record.title,
      description: record.description,
      status: this.toDomainStatus(record.status),
      priority: this.toDomainPriority(record.priority),
      dueDate: record.dueDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    return new Task(props);
  }
}
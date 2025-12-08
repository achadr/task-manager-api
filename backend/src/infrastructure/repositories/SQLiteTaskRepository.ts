import { Task, TaskProps, TaskStatus, TaskPriority } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/interfaces/TaskRepository";
import db from "../database/connection";

export class SQLiteTaskRepository implements TaskRepository {
  async save(task: Task): Promise<Task> {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate?.toISOString() ?? null,
      task.createdAt.toISOString(),
      task.updatedAt.toISOString()
    );

    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const stmt = db.prepare("SELECT * FROM tasks WHERE id = ?");
    const row = stmt.get(id) as Record<string, unknown> | undefined;

    if (!row) return null;

    return this.mapRowToTask(row);
  }

  async findAll(): Promise<Task[]> {
    const stmt = db.prepare("SELECT * FROM tasks");
    const rows = stmt.all() as Record<string, unknown>[];

    return rows.map((row) => this.mapRowToTask(row));
  }

  async update(task: Task): Promise<Task> {
    const stmt = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate?.toISOString() ?? null,
      task.updatedAt.toISOString(),
      task.id
    );

    return task;
  }

  async delete(id: string): Promise<void> {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    stmt.run(id);
  }

  async countByStatus(): Promise<Record<string, number>> {
    const stmt = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM tasks
      GROUP BY status
    `);
    const rows = stmt.all() as { status: string; count: number }[];

    const result: Record<string, number> = {
      pending: 0,
      in_progress: 0,
      completed: 0,
    };

    rows.forEach((row) => {
      result[row.status] = row.count;
    });

    return result;
  }

  async countByPriority(): Promise<Record<string, number>> {
    const stmt = db.prepare(`
      SELECT priority, COUNT(*) as count
      FROM tasks
      GROUP BY priority
    `);
    const rows = stmt.all() as { priority: string; count: number }[];

    const result: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    rows.forEach((row) => {
      result[row.priority] = row.count;
    });

    return result;
  }

  private mapRowToTask(row: Record<string, unknown>): Task {
    const props: TaskProps = {
      id: row.id as string,
      title: row.title as string,
      description: row.description as string,
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      dueDate: row.due_date ? new Date(row.due_date as string) : null,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };

    return new Task(props);
  }
}
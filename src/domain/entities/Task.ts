export interface TaskProps {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
  }
  
  export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
  }
  
  export class Task {
    public readonly id: string;
    public title: string;
    public description: string;
    public status: TaskStatus;
    public priority: TaskPriority;
    public dueDate: Date | null;
    public readonly createdAt: Date;
    public updatedAt: Date;
  
    constructor(props: TaskProps) {
      this.id = props.id;
      this.title = props.title;
      this.description = props.description;
      this.status = props.status;
      this.priority = props.priority;
      this.dueDate = props.dueDate;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
    }
  
    // Mark task as completed
    complete(): void {
      if (this.status === TaskStatus.COMPLETED) {
        throw new Error("Task is already completed");
      }
      this.status = TaskStatus.COMPLETED;
      this.updatedAt = new Date();
    }
  
    // Check if task is overdue
    isOverdue(): boolean {
      if (!this.dueDate) return false;
      if (this.status === TaskStatus.COMPLETED) return false;
      return new Date() > this.dueDate;
    }
  
    // Update task details
    updateDetails(title: string, description: string): void {
      this.title = title;
      this.description = description;
      this.updatedAt = new Date();
    }
  }
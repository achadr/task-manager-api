export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface TaskStats {
  total: number
  byStatus: {
    pending: number
    in_progress: number
    completed: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
  }
}

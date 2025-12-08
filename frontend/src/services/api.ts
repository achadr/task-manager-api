import { Task, CreateTaskDto, UpdateTaskDto, TaskStats } from '../types/task'

const API_BASE = '/api'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const taskApi = {
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`)
    return handleResponse<Task[]>(response)
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`)
    return handleResponse<Task>(response)
  },

  async createTask(task: CreateTaskDto): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    return handleResponse<Task>(response)
  },

  async updateTask(id: string, task: UpdateTaskDto): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    return handleResponse<Task>(response)
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Delete failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
  },

  async getTaskStats(): Promise<TaskStats> {
    const response = await fetch(`${API_BASE}/tasks/stats`)
    return handleResponse<TaskStats>(response)
  },
}

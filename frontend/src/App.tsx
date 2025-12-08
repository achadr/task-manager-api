import { useState, useEffect } from 'react'
import './App.css'
import { Task, CreateTaskDto, TaskStats as TaskStatsType } from './types/task'
import { taskApi } from './services/api'
import KanbanColumn from './components/KanbanColumn'
import TaskForm from './components/TaskForm'
import TaskStats from './components/TaskStats'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [pendingSort, setPendingSort] = useState<'date' | 'priority'>('date')
  const [inProgressSort, setInProgressSort] = useState<'date' | 'priority'>('date')
  const [completedSort, setCompletedSort] = useState<'date' | 'priority'>('date')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await Promise.all([fetchTasks(), fetchStats()])
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await taskApi.getAllTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const data = await taskApi.getTaskStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleCreateTask = async (taskData: CreateTaskDto) => {
    try {
      await taskApi.createTask(taskData)
      setShowForm(false)
      await loadData()
    } catch (err) {
      throw err
    }
  }

  const handleUpdateTask = async (taskData: CreateTaskDto) => {
    if (!editingTask) return

    try {
      await taskApi.updateTask(editingTask.id, taskData)
      setShowForm(false)
      setEditingTask(undefined)
      await loadData()
    } catch (err) {
      throw err
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTask(undefined)
  }

  const handleNewTask = () => {
    setEditingTask(undefined)
    setShowForm(true)
  }

  const pendingTasks = tasks.filter(task => task.status === 'pending')
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  if (loading) {
    return <div className="container">Loading tasks...</div>
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button className="btn btn-primary" onClick={handleNewTask}>
          + New Task
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <TaskStats stats={stats} loading={statsLoading} />

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task!</p>
          <button className="btn btn-primary" onClick={handleNewTask}>
            Create Task
          </button>
        </div>
      ) : (
        <div className="kanban-board">
          <KanbanColumn
            status="pending"
            title="Pending"
            tasks={pendingTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            sortBy={pendingSort}
            onSortChange={setPendingSort}
          />
          <KanbanColumn
            status="in_progress"
            title="In Progress"
            tasks={inProgressTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            sortBy={inProgressSort}
            onSortChange={setInProgressSort}
          />
          <KanbanColumn
            status="completed"
            title="Completed"
            tasks={completedTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            sortBy={completedSort}
            onSortChange={setCompletedSort}
          />
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
}

export default App

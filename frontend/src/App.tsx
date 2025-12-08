import { useState, useEffect } from 'react'
import './App.css'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">Loading tasks...</div>
  }

  if (error) {
    return <div className="container error">Error: {error}</div>
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks found. Create your first task!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className={`badge priority-${task.priority}`}>
                  {task.priority}
                </span>
                <span className={`badge status-${task.status}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App

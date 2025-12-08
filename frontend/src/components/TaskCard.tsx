import { Task } from '../types/task'
import './TaskCard.css'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id)
    }
  }

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <div className="task-card-actions">
          <button
            className="btn-icon btn-edit"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={handleDelete}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="task-description">{task.description || 'No description'}</p>

      <div className="task-meta">
        <span className={`badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className={`badge status-${task.status}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      <div className="task-dates">
        <small>Created: {formatDate(task.createdAt)}</small>
        {task.createdAt !== task.updatedAt && (
          <small>Updated: {formatDate(task.updatedAt)}</small>
        )}
      </div>
    </div>
  )
}

import { Task } from '../types/task'
import TaskCard from './TaskCard'
import './KanbanColumn.css'

interface KanbanColumnProps {
  status: 'pending' | 'in_progress' | 'completed'
  title: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  sortBy: 'date' | 'priority'
  onSortChange: (sortBy: 'date' | 'priority') => void
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  onEdit,
  onDelete,
  sortBy,
  onSortChange,
}: KanbanColumnProps) {
  const getSortedTasks = () => {
    const sortedTasks = [...tasks]

    if (sortBy === 'date') {
      sortedTasks.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      sortedTasks.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
    }

    return sortedTasks
  }

  const sortedTasks = getSortedTasks()

  return (
    <div className={`kanban-column kanban-column-${status}`}>
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>

      <div className="kanban-column-controls">
        <label htmlFor={`sort-${status}`}>Sort by:</label>
        <select
          id={`sort-${status}`}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date' | 'priority')}
          className="sort-select"
        >
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="kanban-column-tasks">
        {sortedTasks.length === 0 ? (
          <div className="kanban-column-empty">No tasks</div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

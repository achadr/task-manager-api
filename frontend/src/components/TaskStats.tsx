import { TaskStats as TaskStatsType } from '../types/task'
import './TaskStats.css'

interface TaskStatsProps {
  stats: TaskStatsType | null
  loading: boolean
}

export default function TaskStats({ stats, loading }: TaskStatsProps) {
  if (loading) {
    return (
      <div className="stats-container">
        <div className="stats-loading">Loading statistics...</div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="stats-container">
      <h2>Task Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-group">
          <h3>By Status</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-badge status-pending">Pending</span>
              <span className="stat-count">{stats.byStatus.pending}</span>
            </div>
            <div className="stat-item">
              <span className="stat-badge status-in_progress">In Progress</span>
              <span className="stat-count">{stats.byStatus.in_progress}</span>
            </div>
            <div className="stat-item">
              <span className="stat-badge status-completed">Completed</span>
              <span className="stat-count">{stats.byStatus.completed}</span>
            </div>
          </div>
        </div>

        <div className="stat-group">
          <h3>By Priority</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-badge priority-low">Low</span>
              <span className="stat-count">{stats.byPriority.low}</span>
            </div>
            <div className="stat-item">
              <span className="stat-badge priority-medium">Medium</span>
              <span className="stat-count">{stats.byPriority.medium}</span>
            </div>
            <div className="stat-item">
              <span className="stat-badge priority-high">High</span>
              <span className="stat-count">{stats.byPriority.high}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

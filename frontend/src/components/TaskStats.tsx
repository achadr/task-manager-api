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

  if (!stats || stats.total === 0) {
    return null
  }

  const completionPercentage = stats.total > 0
    ? Math.round((stats.byStatus.completed / stats.total) * 100)
    : 0

  const getPercentage = (value: number) => {
    return stats.total > 0 ? (value / stats.total) * 100 : 0
  }

  return (
    <div className="stats-container">
      <h2>Task Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
          <div className="completion-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${completionPercentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{completionPercentage}%</text>
            </svg>
            <div className="completion-label">Completed</div>
          </div>
        </div>

        <div className="stat-group">
          <h3>By Status</h3>
          <div className="chart-items">
            <div className="chart-item">
              <div className="chart-header">
                <span className="stat-badge status-pending">Pending</span>
                <span className="stat-count">{stats.byStatus.pending}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill status-pending-fill"
                  style={{ width: `${getPercentage(stats.byStatus.pending)}%` }}
                />
              </div>
            </div>
            <div className="chart-item">
              <div className="chart-header">
                <span className="stat-badge status-in_progress">In Progress</span>
                <span className="stat-count">{stats.byStatus.in_progress}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill status-in_progress-fill"
                  style={{ width: `${getPercentage(stats.byStatus.in_progress)}%` }}
                />
              </div>
            </div>
            <div className="chart-item">
              <div className="chart-header">
                <span className="stat-badge status-completed">Completed</span>
                <span className="stat-count">{stats.byStatus.completed}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill status-completed-fill"
                  style={{ width: `${getPercentage(stats.byStatus.completed)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="stat-group">
          <h3>By Priority</h3>
          <div className="chart-items">
            <div className="chart-item">
              <div className="chart-header">
                <span className="stat-badge priority-low">Low</span>
                <span className="stat-count">{stats.byPriority.low}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill priority-low-fill"
                  style={{ width: `${getPercentage(stats.byPriority.low)}%` }}
                />
              </div>
            </div>
            <div className="chart-item">
              <div className="chart-header">
                <span className="stat-badge priority-medium">Medium</span>
                <span className="stat-count">{stats.byPriority.medium}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill priority-medium-fill"
                  style={{ width: `${getPercentage(stats.byPriority.medium)}%` }}
                />
              </div>
            </div>
            <div className="chart-item">
              <div className="chart-header">
                <span className="stat-badge priority-high">High</span>
                <span className="stat-count">{stats.byPriority.high}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill priority-high-fill"
                  style={{ width: `${getPercentage(stats.byPriority.high)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

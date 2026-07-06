import { useStats } from '../hooks/useStats.js'
import { formatCurrency } from '../utils/formatHelper.js'
import { BarChart3, DollarSign, Copy, AlertTriangle } from 'lucide-react'

export default function StatsBar() {
  const stats = useStats()

  if (stats.totalFiles === 0) return null

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <BarChart3 size="14" />
        <span>{stats.totalFiles} file{stats.totalFiles !== 1 ? 's' : ''}</span>
      </div>
      {stats.parsedCount > 0 && (
        <div className="stat-item">
          <DollarSign size="14" />
          <span>{formatCurrency(stats.totalAmount)}</span>
        </div>
      )}
      {stats.pendingCount > 0 && (
        <div className="stat-item stat-warn">
          <AlertTriangle size="14" />
          <span>{stats.pendingCount} processing</span>
        </div>
      )}
      {stats.failedCount > 0 && (
        <div className="stat-item stat-error">
          <AlertTriangle size="14" />
          <span>{stats.failedCount} failed</span>
        </div>
      )}
      {stats.duplicateCount > 0 && (
        <div className="stat-item stat-warn">
          <Copy size="14" />
          <span>{stats.duplicateCount} dup{stats.duplicateCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      <style>{`
        .stats-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-top: 1px solid var(--border);
          background: #FAFAFA;
          font-size: 12px;
          color: var(--text-secondary);
          flex-shrink: 0;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .stat-warn {
          color: var(--warning);
        }
        .stat-error {
          color: var(--danger);
        }
      `}</style>
    </div>
  )
}

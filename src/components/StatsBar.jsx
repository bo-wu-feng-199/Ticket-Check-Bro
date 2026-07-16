import { useTranslation } from 'react-i18next'
import { useStats } from '../hooks/useStats.js'
import { formatCurrency } from '../utils/formatHelper.js'
import { BarChart3, DollarSign, Copy, AlertTriangle, FileText } from 'lucide-react'

export default function StatsBar() {
  const { t } = useTranslation()
  const stats = useStats()

  if (stats.totalFiles === 0) return null

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <BarChart3 size="14" />
        <span>{stats.totalFiles}{t('stats.files')}</span>
      </div>
      {stats.parsedCount > 0 && (
        <div className="stat-item">
          <FileText size="14" />
          <span>{stats.documentTypeBreakdown}</span>
        </div>
      )}
      {stats.parsedCount > 0 && (
        <div className="stat-item">
          <DollarSign size="14" />
          <span>{formatCurrency(stats.totalAmount)}</span>
        </div>
      )}
      {stats.pendingCount > 0 && (
        <div className="stat-item stat-warn">
          <AlertTriangle size="14" />
          <span>{stats.pendingCount} {t('stats.pending')}</span>
        </div>
      )}
      {stats.failedCount > 0 && (
        <div className="stat-item stat-error">
          <AlertTriangle size="14" />
          <span>{stats.failedCount} {t('stats.failed')}</span>
        </div>
      )}
      {stats.duplicateCount > 0 && (
        <div className="stat-item stat-warn">
          <Copy size="14" />
          <span>{stats.duplicateCount} {t('stats.duplicates')}</span>
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

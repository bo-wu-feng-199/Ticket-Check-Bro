import { useTranslation } from 'react-i18next'
import { useInvoiceStore } from '../store/invoiceStore.js'

export default function FileActions() {
  const { t } = useTranslation()
  const entries = useInvoiceStore(s => s.entries)
  const removeEntry = useInvoiceStore(s => s.removeEntry)
  const clearAll = useInvoiceStore(s => s.clearAll)
  const moveEntry = useInvoiceStore(s => s.moveEntry)
  const selectedUid = useInvoiceStore(s => s.selectedUid)
  const selectedUids = useInvoiceStore(s => s.selectedUids)
  const toggleSelect = useInvoiceStore(s => s.toggleSelect)
  const selectAll = useInvoiceStore(s => s.selectAll)
  const clearSelection = useInvoiceStore(s => s.clearSelection)
  const batchRemove = useInvoiceStore(s => s.batchRemove)

  const selectedIndex = entries.findIndex(e => e.uid === selectedUid)
  const isFirst = selectedIndex <= 0
  const isLast = selectedIndex >= entries.length - 1
  const allSelected = entries.length > 0 && selectedUids.length === entries.length

  const handleSelectAllChange = () => {
    if (allSelected) {
      clearSelection()
    } else {
      selectAll()
    }
  }

  return (
    <div className="file-actions">
      {entries.length > 0 && (
        <label className="file-actions-select-all" title={t('fileActions.selectAll')}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
          />
        </label>
      )}
      <button
        className="btn btn-icon"
        onClick={() => moveEntry(selectedIndex, selectedIndex - 1)}
        disabled={selectedIndex === -1 || isFirst}
        title={t('fileActions.moveUp')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
      <button
        className="btn btn-icon"
        onClick={() => moveEntry(selectedIndex, selectedIndex + 1)}
        disabled={selectedIndex === -1 || isLast}
        title={t('fileActions.moveDown')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div className="file-actions-spacer" />
      {selectedUids.length > 0 && (
        <button className="btn btn-danger-text" onClick={batchRemove} title={t('fileActions.deleteSelected')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          {t('fileActions.deleteSelected')} ({selectedUids.length})
        </button>
      )}
      {selectedUid && (
        <button className="btn btn-icon btn-danger" onClick={() => removeEntry(selectedUid)} title={t('fileActions.remove')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      )}
      {entries.length > 0 && (
        <button className="btn btn-icon btn-danger" onClick={clearAll} title={t('fileActions.clearAll')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          </svg>
        </button>
      )}

      <style>{`
        .file-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
        }
        .file-actions-spacer {
          flex: 1;
        }
        .file-actions-select-all {
          display: flex;
          align-items: center;
          padding: 0 2px;
          cursor: pointer;
        }
        .file-actions-select-all input[type="checkbox"] {
          width: 14px;
          height: 14px;
          cursor: pointer;
          accent-color: var(--primary);
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--card-bg);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition);
          font-size: 13px;
          padding: 6px 10px;
        }
        .btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-icon {
          width: 32px;
          height: 32px;
          padding: 0;
        }
        .btn-danger:hover:not(:disabled) {
          border-color: var(--danger);
          color: var(--danger);
          background: #FFF5F5;
        }
        .btn-danger-text {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--card-bg);
          color: var(--danger);
          cursor: pointer;
          transition: all var(--transition);
          font-size: 13px;
          padding: 6px 10px;
          white-space: nowrap;
        }
        .btn-danger-text:hover {
          border-color: var(--danger);
          background: #FFF5F5;
        }
      `}</style>
    </div>
  )
}

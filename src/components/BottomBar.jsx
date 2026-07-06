import { useInvoiceStore } from '../store/invoiceStore.js'
import { exportToExcel } from '../core/exporter/ExcelExporter.js'
import { Download } from 'lucide-react'

export default function BottomBar() {
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const parsedCount = entries.filter(e => e.status === 'parsed').length

  const handleExport = () => {
    exportToExcel(entries, results)
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-info">
        <span className="bottom-bar-count">{parsedCount} par{parsedCount !== 1 ? 's' : ''}ed documen{parsedCount !== 1 ? 'ts' : 't'}</span>
        {parsedCount > 0 && <span className="bottom-bar-sep">&middot;</span>}
        {parsedCount > 0 && (
          <span className="bottom-bar-ready">Ready for export</span>
        )}
      </div>
      <div className="bottom-bar-actions">
        <button
          className="btn btn-primary"
          onClick={handleExport}
          disabled={parsedCount === 0}
        >
          <Download size="16" />
          Export to Excel
        </button>
      </div>

      <style>{`
        .bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: var(--card-bg);
          border-top: 1px solid var(--border);
          gap: 16px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .bottom-bar-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .bottom-bar-sep { opacity: 0.3; }
        .bottom-bar-ready { color: var(--success); font-weight: 500; }
        .bottom-bar-actions { display: flex; gap: 8px; }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-primary);
        }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-primary {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
        .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
        @media (max-width: 640px) {
          .bottom-bar { flex-direction: column; align-items: stretch; }
          .bottom-bar-actions .btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}

import { useInvoiceStore } from '../store/invoiceStore.js'
import { exportToExcel } from '../core/exporter/ExcelExporter.js'
import { Download, CheckCircle2 } from 'lucide-react'

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
        {parsedCount > 0 ? (
          <>
            <CheckCircle2 size="16" className="bottom-bar-icon" />
            <span className="bottom-bar-count">{parsedCount} file{parsedCount !== 1 ? 's' : ''} parsed</span>
            <span className="bottom-bar-sep">&middot;</span>
            <span className="bottom-bar-ready">Ready for export</span>
          </>
        ) : (
          <span className="bottom-bar-count">No parsed documents</span>
        )}
      </div>
      <div className="bottom-bar-actions">
        <button
          className="btn-export"
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
          padding: 12px 24px;
          background: var(--card-bg);
          border-top: 1px solid var(--card-border);
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
        .bottom-bar-icon { color: var(--success); }
        .bottom-bar-sep { opacity: 0.3; }
        .bottom-bar-ready { color: var(--success); font-weight: 500; }
        .bottom-bar-actions { display: flex; gap: 8px; }

        .btn-export {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          background: var(--primary);
          color: #fff;
          border: none;
          letter-spacing: -0.2px;
        }
        .btn-export:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .btn-export:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .btn-export:active:not(:disabled) {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .bottom-bar { flex-direction: column; align-items: stretch; }
          .bottom-bar-actions .btn-export { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}

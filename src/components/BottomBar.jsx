import { useState } from 'react'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { exportToExcel } from '../core/exporter/ExcelExporter.js'
import { mergePdfs } from '../core/exporter/PdfMerger.js'
import { Download, FileUp, Tag, CheckCircle2 } from 'lucide-react'
import BatchRenameModal from './BatchRenameModal.jsx'

export default function BottomBar() {
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const parsedCount = entries.filter(e => e.status === 'parsed').length
  const pdfCount = entries.filter(e =>
    e.mimeType === 'application/pdf' || /\.pdf$/i.test(e.fileName)
  ).length
  const [showRenameModal, setShowRenameModal] = useState(false)

  const handleExport = () => {
    exportToExcel(entries, results)
  }

  const handleMerge = async () => {
    try {
      await mergePdfs(entries)
    } catch (err) {
      console.error('Merge failed:', err)
      alert(`Merge failed: ${err.message}`)
    }
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
          className="btn-merge"
          onClick={handleMerge}
          disabled={pdfCount < 2}
          title={pdfCount < 2 ? `Need at least 2 PDFs (found ${pdfCount})` : `Merge ${pdfCount} PDFs`}
        >
          <FileUp size="16" />
          Merge PDFs
          {pdfCount >= 2 && <span className="btn-badge">{pdfCount}</span>}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setShowRenameModal(true)}
          disabled={parsedCount === 0}
          title={parsedCount === 0 ? 'Parse a document first' : `Rename ${parsedCount} files`}
        >
          <Tag size="16" />
          Batch Rename
          {parsedCount >= 1 && <span className="btn-badge">{parsedCount}</span>}
        </button>
        <button
          className="btn-export"
          onClick={handleExport}
          disabled={parsedCount === 0}
        >
          <Download size="16" />
          Export to Excel
        </button>
      </div>

      {showRenameModal && <BatchRenameModal onClose={() => setShowRenameModal(false)} />}

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

        .btn-export,
        .btn-merge,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          border: none;
          letter-spacing: -0.2px;
        }

        .btn-secondary {
          background: var(--card-bg);
          color: var(--text-secondary);
          border: 1.5px solid var(--border);
        }
        .btn-secondary:hover:not(:disabled) {
          background: var(--bg-alt);
          border-color: var(--text-muted);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        .btn-secondary:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .btn-secondary:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-export {
          background: var(--primary);
          color: #fff;
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

        .btn-merge {
          background: var(--card-bg);
          color: var(--primary);
          border: 1.5px solid var(--primary);
        }
        .btn-merge:hover:not(:disabled) {
          background: var(--primary-light);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .btn-merge:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          border-color: var(--border);
          color: var(--text-muted);
        }
        .btn-merge:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 9px;
          background: var(--primary);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
        }
        .btn-merge:disabled .btn-badge {
          background: var(--text-muted);
        }

        @media (max-width: 640px) {
          .bottom-bar { flex-direction: column; align-items: stretch; }
          .bottom-bar-actions { flex-direction: column; }
          .bottom-bar-actions .btn-export,
          .bottom-bar-actions .btn-merge,
          .bottom-bar-actions .btn-secondary { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}

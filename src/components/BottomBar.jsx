import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { exportToExcel } from '../core/exporter/ExcelExporter.js'
import { Download, FileUp, Tag, CheckCircle2, Camera } from 'lucide-react'
import BatchRenameModal from './BatchRenameModal.jsx'
import MergeModal from './MergeModal.jsx'
import html2canvas from 'html2canvas'

export default function BottomBar() {
  const { t, i18n } = useTranslation()
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const parsedCount = entries.filter(e => e.status === 'parsed').length
  const pdfCount = entries.filter(e =>
    e.mimeType === 'application/pdf' || /\.pdf$/i.test(e.fileName)
  ).length
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [shareState, setShareState] = useState(null) // null | 'loading' | 'success'

  const handleExport = () => {
    const name = window.prompt(t('bottomBar.exportPrompt'), 'ticket-check-bro-export')
    if (name === null) return
    exportToExcel(entries, results, name + '.xlsx')
  }

  const handleMerge = () => {
    setShowMergeModal(true)
  }

  const handleShare = async () => {
    setShareState('loading')
    try {
      const el = document.querySelector('.app-shell')
      if (!el) throw new Error('App shell not found')

      const canvas = await html2canvas(el, { useCORS: true, scale: 2 })
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

      if (!blob) throw new Error('Failed to create image blob')

      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
      } catch {
        // Fallback: download the image if clipboard fails
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'ticket-check-screenshot.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 3000)
      }

      setShareState('success')
      setTimeout(() => setShareState(null), 2000)
    } catch (err) {
      console.error('Share screenshot failed:', err)
      setShareState(null)
    }
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-bar-info">
        {parsedCount > 0 ? (
          <>
            <CheckCircle2 size="16" className="bottom-bar-icon" />
            <span className="bottom-bar-count">{parsedCount}{t('bottomBar.files')} {t('bottomBar.parsed')}</span>
            <span className="bottom-bar-sep">&middot;</span>
            <span className="bottom-bar-ready">{t('bottomBar.ready')}</span>
          </>
        ) : (
          <span className="bottom-bar-count">{t('bottomBar.none')}</span>
        )}
      </div>
      <div className="bottom-bar-actions">
        <button
          className="btn-merge"
          onClick={handleMerge}
          disabled={pdfCount < 2}
          title={pdfCount < 2 ? `${t('bottomBar.mergeTooltip')} ${pdfCount})` : `${t('bottomBar.merge')} ${pdfCount} PDFs`}
        >
          <FileUp size="16" />
          {t('bottomBar.merge')}
          {pdfCount >= 2 && <span className="btn-badge">{pdfCount}</span>}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setShowRenameModal(true)}
          disabled={parsedCount === 0}
          title={parsedCount === 0 ? t('bottomBar.none') : `${t('bottomBar.rename')} ${parsedCount}${t('bottomBar.files')}`}
        >
          <Tag size="16" />
          {t('bottomBar.rename')}
          {parsedCount >= 1 && <span className="btn-badge">{parsedCount}</span>}
        </button>
        <button
          className="btn-export"
          onClick={handleExport}
          disabled={parsedCount === 0}
        >
          <Download size="16" />
          {t('bottomBar.export')}
        </button>
        <button
          className="btn-secondary"
          onClick={handleShare}
          disabled={shareState === 'loading'}
        >
          {shareState === 'loading' ? (
            <span className="btn-spinner" />
          ) : (
            <Camera size="16" />
          )}
          {shareState === 'success' ? 'Copied!' : 'Share as Image'}
        </button>
      </div>

      {showRenameModal && <BatchRenameModal onClose={() => setShowRenameModal(false)} />}
      {showMergeModal && <MergeModal onClose={() => setShowMergeModal(false)} />}

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

        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: btnSpin 0.6s linear infinite;
        }
        @keyframes btnSpin { to { transform: rotate(360deg); } }

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

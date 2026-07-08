import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { getFile } from '../store/fileRefs.js'
import { mergePdfs } from '../core/exporter/PdfMerger.js'
import { PDFDocument } from 'pdf-lib'
import { X, FileUp, CheckSquare, Square } from 'lucide-react'

export default function MergeModal({ onClose }) {
  const { t } = useTranslation()
  const entries = useInvoiceStore(s => s.entries)
  const [pageInfo, setPageInfo] = useState(null) // { [uid]: { fileName, pageCount } }
  const [selectedPages, setSelectedPages] = useState(null) // { [uid]: number[] }
  const [loading, setLoading] = useState(true)
  const [merging, setMerging] = useState(false)

  const pdfEntries = useMemo(() =>
    entries.filter(e =>
      e.mimeType === 'application/pdf' || /\.pdf$/i.test(e.fileName)
    ),
    [entries]
  )

  useEffect(() => {
    ;(async () => {
      const info = {}
      const selections = {}
      for (const entry of pdfEntries) {
        try {
          const file = getFile(entry.uid)
          if (!file) continue
          const arrayBuffer = await file.arrayBuffer()
          const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
          const pageCount = doc.getPageCount()
          info[entry.uid] = { fileName: entry.fileName, pageCount }
          selections[entry.uid] = Array.from({ length: pageCount }, (_, i) => i)
        } catch (err) {
          console.error(`Failed to read pages for ${entry.fileName}:`, err)
          info[entry.uid] = { fileName: entry.fileName, pageCount: 0, error: true }
          selections[entry.uid] = []
        }
      }
      setPageInfo(info)
      setSelectedPages(selections)
      setLoading(false)
    })()
  }, [pdfEntries])

  function togglePage(uid, pageIndex) {
    setSelectedPages(prev => {
      const current = prev[uid]
      const next = current.includes(pageIndex)
        ? current.filter(p => p !== pageIndex)
        : [...current, pageIndex].sort((a, b) => a - b)
      return { ...prev, [uid]: next }
    })
  }

  function toggleAll(uid) {
    setSelectedPages(prev => {
      const total = pageInfo[uid]?.pageCount || 0
      const allSelected = prev[uid]?.length === total
      return {
        ...prev,
        [uid]: allSelected ? [] : Array.from({ length: total }, (_, i) => i)
      }
    })
  }

  async function handleMerge() {
    setMerging(true)
    try {
      await mergePdfs(entries, selectedPages)
      onClose()
    } catch (err) {
      console.error('Merge failed:', err)
      alert(t('bottomBar.mergeFail') + err.message)
    }
    setMerging(false)
  }

  const totalSelected = selectedPages
    ? Object.values(selectedPages).reduce((sum, arr) => sum + arr.length, 0)
    : 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card merge-modal-card" onClick={e => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="modal-header">
          <h2>{t('bottomBar.merge')}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size="18" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="modal-section merge-section">
          {loading ? (
            <div className="merge-loading">
              <span className="btn-spinner" />
              <span>Reading PDF pages...</span>
            </div>
          ) : (
            <div className="merge-table-wrap">
              <table className="preview-table merge-table">
                <thead>
                  <tr>
                    <th className="merge-col-file">File Name</th>
                    <th className="merge-col-pages">Pages</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfEntries.map(entry => {
                    const info = pageInfo?.[entry.uid]
                    if (!info) return null
                    const pages = selectedPages?.[entry.uid] || []
                    const allSelected = pages.length === info.pageCount
                    return (
                      <tr key={entry.uid}>
                        <td className="merge-col-file">
                          <span className="merge-filename" title={info.fileName}>
                            {info.fileName}
                          </span>
                          {info.error && <span className="merge-error">Read error</span>}
                        </td>
                        <td className="merge-col-pages">
                          <button
                            className="merge-toggle-all"
                            onClick={() => toggleAll(entry.uid)}
                            title={allSelected ? 'Deselect all' : 'Select all'}
                          >
                            {allSelected ? <CheckSquare size="14" /> : <Square size="14" />}
                            <span>{info.pageCount} pages</span>
                          </button>
                          <div className="merge-page-checks">
                            {Array.from({ length: info.pageCount }, (_, i) => (
                              <label key={i} className={`merge-page-label ${pages.includes(i) ? 'checked' : ''}`}>
                                <input
                                  type="checkbox"
                                  checked={pages.includes(i)}
                                  onChange={() => togglePage(entry.uid, i)}
                                />
                                <span>{i + 1}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="modal-footer">
          <span className="merge-summary">
            {totalSelected} page{totalSelected !== 1 ? 's' : ''} selected from {pdfEntries.length} file{pdfEntries.length !== 1 ? 's' : ''}
          </span>
          <button className="btn-cancel" onClick={onClose}>
            {t('rename.cancel')}
          </button>
          <button
            className="btn-apply"
            onClick={handleMerge}
            disabled={loading || merging || totalSelected === 0}
          >
            {merging ? (
              <>
                <span className="btn-spinner" />
                Merging...
              </>
            ) : (
              <>
                <FileUp size="16" />
                Merge Selected
              </>
            )}
          </button>
        </div>

        {/* ── Styles ── */}
        <style>{`
          .merge-modal-card { max-width: 760px; }
          .merge-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding-bottom: 0; }
          .merge-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 40px; color: var(--text-muted); font-size: 14px; }
          .merge-table-wrap { overflow-y: auto; max-height: 400px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
          .merge-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .merge-table th { padding: 8px 12px; text-align: left; font-weight: 600; color: var(--text-muted); background: var(--bg-alt); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 1; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          .merge-table td { padding: 8px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
          .merge-table tr:last-child td { border-bottom: none; }
          .merge-table tr:hover td { background: var(--bg); }
          .merge-col-file { width: 35%; }
          .merge-col-pages { width: 65%; }
          .merge-filename { display: block; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
          .merge-error { display: inline-block; margin-left: 6px; padding: 1px 5px; border-radius: 3px; background: #FFEBEE; color: #C62828; font-size: 9px; font-weight: 700; }
          .merge-toggle-all { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px 2px 2px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--card-bg); color: var(--text-secondary); cursor: pointer; font-size: 11px; font-weight: 500; margin-bottom: 6px; transition: all var(--transition-fast); }
          .merge-toggle-all:hover { border-color: var(--primary); color: var(--primary); }
          .merge-page-checks { display: flex; flex-wrap: wrap; gap: 4px; }
          .merge-page-label { display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; border: 1px solid var(--border); border-radius: 3px; cursor: pointer; font-size: 11px; color: var(--text-secondary); transition: all var(--transition-fast); user-select: none; }
          .merge-page-label:hover { border-color: var(--primary); }
          .merge-page-label.checked { background: var(--primary-light); border-color: var(--primary); color: var(--primary); font-weight: 600; }
          .merge-page-label input { display: none; }
          .merge-summary { font-size: 12px; color: var(--text-secondary); margin-right: auto; }
          .btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: btnSpin 0.6s linear infinite; display: inline-block; }
          @keyframes btnSpin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}

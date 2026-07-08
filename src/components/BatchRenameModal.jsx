import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import JSZip from 'jszip'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { generateFilename } from '../core/renamer.js'
import { getFile } from '../store/fileRefs.js'
import { sanitizeFilename } from '../utils/formatHelper.js'
import { X, Variable, Download, RotateCcw, FileType, Building2, DollarSign, Hash, Calendar, User, ArrowRight } from 'lucide-react'

/**
 * Variable chips — click to insert into the template at cursor position.
 * Union of all useful fields across all document types.
 */
const VARIABLE_CHIPS = [
  { key: 'type',           label: 'Type',         icon: 'FileType',    desc: 'Document type label' },
  { key: 'buyerName',      label: 'Buyer',        icon: 'Building2',   desc: 'Buyer/Company name' },
  { key: 'sellerName',     label: 'Seller',       icon: 'Building2',   desc: 'Seller name' },
  { key: 'totalAmount',    label: 'Total',        icon: 'DollarSign',  desc: 'Total amount w/ ¥' },
  { key: 'amount',         label: 'Amount',       icon: 'DollarSign',  desc: 'Subtotal amount' },
  { key: 'invoiceNumber',  label: 'Invoice No.',  icon: 'Hash',        desc: 'Invoice number' },
  { key: 'invoiceCode',    label: 'Invoice Code', icon: 'Hash',        desc: 'Invoice code' },
  { key: 'issueDate',      label: 'Issue Date',   icon: 'Calendar',    desc: 'Document issue date' },
  { key: 'date',           label: 'Date',         icon: 'Calendar',    desc: 'Event/transaction date' },
  { key: 'passengerName',  label: 'Passenger',    icon: 'User',        desc: 'Passenger name' },
]

const VARIABLE_ICONS = {
  FileType, Building2, DollarSign, Hash, Calendar, User
}

function getExt(fileName) {
  const idx = fileName.lastIndexOf('.')
  return idx >= 0 ? fileName.slice(idx) : ''
}

export default function BatchRenameModal({ onClose }) {
  const { t } = useTranslation()
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const config = useInvoiceStore(s => s.config)
  const updateConfig = useInvoiceStore(s => s.updateConfig)

  const [template, setTemplate] = useState(config.renameTemplate || '{type}-{buyerName}-{amount}')
  const [selectedVar, setSelectedVar] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [successCount, setSuccessCount] = useState(0)

  // Only parsed entries can be renamed
  const parsedEntries = useMemo(() =>
    entries.filter(e => e.status === 'parsed' && results[e.uid]),
    [entries, results]
  )

  // Preview: old name → new name for every parsed entry
  const previewRows = useMemo(() =>
    parsedEntries.map(entry => {
      const result = results[entry.uid]
      const ext = getExt(entry.fileName)
      const newName = generateFilename(template, result, ext)
      return {
        uid: entry.uid,
        oldName: entry.fileName,
        newName,
        documentLabel: result?.documentLabel || 'Unknown'
      }
    }),
    [parsedEntries, results, template]
  )

  // Detect if any new names collide
  const nameCollisions = useMemo(() => {
    const names = previewRows.map(r => r.newName)
    const seen = new Set()
    const dupes = new Set()
    for (const name of names) {
      if (seen.has(name)) dupes.add(name)
      seen.add(name)
    }
    return dupes
  }, [previewRows])

  const hasEntries = parsedEntries.length > 1

  // ── Insert variable at cursor position ──
  function insertVariable(varKey) {
    const el = document.querySelector('.rename-template-input')
    if (!el) {
      setTemplate(t => t + `{${varKey}}`)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const before = template.slice(0, start)
    const after = template.slice(end)
    const newVal = before + `{${varKey}}` + after
    setTemplate(newVal)
    // Restore cursor after the inserted variable
    requestAnimationFrame(() => {
      const pos = start + varKey.length + 2
      el.setSelectionRange(pos, pos)
      el.focus()
    })
  }

  // ── Download all renamed files as a single ZIP ──
  async function handleDownload() {
    setDownloading(true)
    setSuccessCount(0)

    try {
      const zip = new JSZip()
      let count = 0

      for (const row of previewRows) {
        const file = getFile(row.uid)
        if (!file) continue
        zip.file(row.newName, file.arrayBuffer())
        count++
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'renamed-files.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 3000)

      setSuccessCount(count)
    } catch (err) {
      console.error('ZIP export failed:', err)
    }

    setDownloading(false)
  }

  // ── Save template to store when closing ──
  function handleClose() {
    updateConfig({ renameTemplate: template })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="modal-header">
          <h2>{t('rename.title')}</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size="18" />
          </button>
        </div>

        {/* ── Template ── */}
        <div className="modal-section">
          <label className="rename-label">{t('rename.template')}</label>
          <input
            className="rename-template-input"
            type="text"
            value={template}
            onChange={e => setTemplate(e.target.value)}
            placeholder="{type}-{buyerName}-{amount}"
            spellCheck={false}
          />
          <div className="rename-hint">
            {t('rename.hint')}
          </div>
        </div>

        {/* ── Variable chips ── */}
        <div className="rename-chips">
          {VARIABLE_CHIPS.map(v => {
            const IconComp = VARIABLE_ICONS[v.icon] || Variable
            return (
              <button
                key={v.key}
                className="rename-chip"
                onClick={() => insertVariable(v.key)}
                title={v.desc}
              >
                <IconComp size="12" />
                {'{'}{v.key}{'}'}
              </button>
            )
          })}
        </div>

        {/* ── Preview table ── */}
        <div className="modal-section preview-section">
          <div className="preview-header">
            <span className="preview-title">
              {t('rename.preview')} ({previewRows.length}{t('rename.files')})
              {nameCollisions.size > 0 && (
                <span className="preview-warning">
                  ⚠️ {nameCollisions.size}{t('rename.collision')}
                </span>
              )}
            </span>
            {template !== config.renameTemplate && (
              <button
                className="rename-reset"
                onClick={() => setTemplate(config.renameTemplate)}
              >
                <RotateCcw size="12" />
                {t('rename.reset')}
              </button>
            )}
          </div>

          {previewRows.length === 0 ? (
            <div className="preview-empty">
              {t('rename.empty')}
            </div>
          ) : (
            <div className="preview-table-wrap">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>{t('rename.original')}</th>
                    <th></th>
                    <th>{t('rename.new')}</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map(row => (
                    <tr key={row.uid} className={nameCollisions.has(row.newName) ? 'collision-row' : ''}>
                      <td className="cell-old" title={row.oldName}>
                        <span className="cell-text">{row.oldName}</span>
                      </td>
                      <td className="cell-arrow">
                        <ArrowRight size="14" />
                      </td>
                      <td className="cell-new" title={row.newName}>
                        <span className="cell-text">{row.newName}</span>
                        {nameCollisions.has(row.newName) && (
                          <span className="collision-badge">dup</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="modal-footer">
          {successCount > 0 && (
            <span className="download-success">
              {t('rename.success')} {successCount}{t('rename.downloadSuccess')}
            </span>
          )}
          <button className="btn-cancel" onClick={handleClose}>
            {t('rename.cancel')}
          </button>
          <button
            className="btn-apply"
            onClick={handleDownload}
            disabled={downloading || previewRows.length === 0}
          >
            {downloading ? (
              <>
                <span className="btn-spinner" />
                {t('rename.downloading')}
              </>
            ) : (
              <>
                <Download size="16" />
                {t('rename.download')} ({previewRows.length})
              </>
            )}
          </button>
        </div>

        {/* ── Styles ── */}
        <style>{`
          /* ── Overlay ── */
          .modal-overlay {
            position: fixed; inset: 0;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000;
            padding: 20px;
            animation: fadeIn 0.15s ease;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

          .modal-card {
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg), 0 0 0 1px var(--card-border);
            width: 100%;
            max-width: 680px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.25s var(--bounce);
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }

          /* ── Header ── */
          .modal-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 20px 24px 0;
          }
          .modal-header h2 {
            font-size: 17px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.3px;
          }
          .modal-close {
            display: flex; align-items: center; justify-content: center;
            width: 32px; height: 32px;
            border-radius: var(--radius-sm);
            border: none;
            background: transparent;
            color: var(--text-muted);
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .modal-close:hover {
            background: var(--bg-alt);
            color: var(--text-primary);
          }

          /* ── Sections ── */
          .modal-section {
            padding: 16px 24px 0;
          }
          .rename-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .rename-template-input {
            width: 100%;
            padding: 10px 14px;
            border: 1.5px solid var(--border);
            border-radius: var(--radius-sm);
            font-size: 14px;
            font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
            color: var(--text-primary);
            background: var(--bg);
            transition: border-color var(--transition);
            outline: none;
          }
          .rename-template-input:focus {
            border-color: var(--border-focus);
            box-shadow: var(--shadow-glow);
          }
          .rename-hint {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 5px;
          }
          .rename-hint code {
            background: var(--bg-alt);
            padding: 1px 5px;
            border-radius: 3px;
            font-size: 11px;
          }

          /* ── Chips ── */
          .rename-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 12px 24px;
          }
          .rename-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid var(--border);
            background: var(--card-bg);
            color: var(--text-secondary);
            font-size: 11px;
            font-weight: 600;
            font-family: 'SF Mono', 'Fira Code', monospace;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .rename-chip:hover {
            border-color: var(--primary);
            background: var(--primary-light);
            color: var(--primary);
          }

          /* ── Preview ── */
          .preview-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding-bottom: 0;
          }
          .preview-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .preview-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .preview-warning {
            color: var(--warning);
            font-weight: 700;
            margin-left: 8px;
            text-transform: none;
            letter-spacing: 0;
          }
          .rename-reset {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            background: var(--card-bg);
            color: var(--text-muted);
            font-size: 11px;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .rename-reset:hover {
            border-color: var(--danger);
            color: var(--danger);
          }

          .preview-empty {
            padding: 24px;
            text-align: center;
            color: var(--text-muted);
            font-size: 13px;
            background: var(--bg);
            border-radius: var(--radius-sm);
            border: 1px dashed var(--border);
          }

          .preview-table-wrap {
            overflow-y: auto;
            max-height: 320px;
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
          }
          .preview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .preview-table th {
            padding: 8px 12px;
            text-align: left;
            font-weight: 600;
            color: var(--text-muted);
            background: var(--bg-alt);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 1;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .preview-table td {
            padding: 7px 12px;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
          }
          .preview-table tr:last-child td { border-bottom: none; }
          .preview-table tr:hover td { background: var(--bg); }

          .cell-old { width: 42%; }
          .cell-arrow { width: 32px; text-align: center; color: var(--text-muted); padding: 0 4px !important; }
          .cell-new { width: 42%; }
          .cell-text {
            display: block;
            max-width: 240px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .collision-row .cell-new .cell-text { color: var(--warning); font-weight: 600; }
          .collision-badge {
            display: inline-block;
            margin-left: 6px;
            padding: 1px 5px;
            border-radius: 3px;
            background: var(--warning-light);
            color: var(--warning);
            font-size: 9px;
            font-weight: 700;
          }

          /* ── Footer ── */
          .modal-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            padding: 16px 24px;
            border-top: 1px solid var(--card-border);
          }
          .download-success {
            font-size: 12px;
            color: var(--success);
            font-weight: 600;
            margin-right: auto;
            animation: fadeIn 0.2s ease;
          }
          .btn-cancel {
            padding: 8px 18px;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            background: var(--card-bg);
            color: var(--text-secondary);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .btn-cancel:hover {
            background: var(--bg-alt);
            border-color: var(--text-muted);
          }
          .btn-apply {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 9px 20px;
            border-radius: var(--radius-sm);
            border: none;
            background: var(--primary);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition);
          }
          .btn-apply:hover:not(:disabled) {
            background: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          .btn-apply:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }

          .btn-spinner {
            width: 14px; height: 14px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: btnSpin 0.6s linear infinite;
          }
          @keyframes btnSpin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}

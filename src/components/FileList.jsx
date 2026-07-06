import { useInvoiceStore } from '../store/invoiceStore.js'
import { formatFileSize } from '../utils/fileHelper.js'
import { FileText, Image, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function FileList() {
  const entries = useInvoiceStore(s => s.entries)
  const selectedUid = useInvoiceStore(s => s.selectedUid)
  const selectEntry = useInvoiceStore(s => s.selectEntry)

  if (entries.length === 0) {
    return (
      <div className="file-list-empty">
        <FileText size="24" opacity="0.3" />
        <p>No documents added yet</p>
        <p className="file-list-hint">Drag & drop or click the area above</p>

        <style>{`
          .file-list-empty {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            gap: 8px;
            padding: 40px 20px;
          }
          .file-list-hint {
            font-size: 12px;
            opacity: 0.7;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="file-list">
      {entries.map((entry, index) => {
        const isSelected = entry.uid === selectedUid
        const isImage = entry.mimeType?.startsWith('image/')

        return (
          <div
            key={entry.uid}
            className={`file-item ${isSelected ? 'selected' : ''}`}
            onClick={() => selectEntry(entry.uid)}
          >
            <div className="file-item-icon">
              {entry.status === 'parsing' ? (
                <Loader2 size="18" className="spin" />
              ) : entry.status === 'failed' ? (
                <AlertCircle size="18" color="var(--danger)" />
              ) : entry.status === 'parsed' ? (
                <CheckCircle size="18" color="var(--success)" />
              ) : (
                isImage ? <Image size="18" /> : <FileText size="18" />
              )}
            </div>
            <div className="file-item-info">
              <span className="file-item-name">{entry.fileName}</span>
              <span className="file-item-meta">
                {formatFileSize(entry.fileSize)} &middot; #{index + 1}
              </span>
            </div>

            <style>{`
              .file-list {
                flex: 1;
                overflow-y: auto;
                padding: 4px 8px;
              }
              .file-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 10px;
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all var(--transition);
              }
              .file-item:hover {
                background: #F5F5F5;
              }
              .file-item.selected {
                background: var(--primary-light);
                border: 1px solid rgba(33, 150, 243, 0.3);
              }
              .file-item-icon {
                flex-shrink: 0;
                width: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-muted);
              }
              .file-item-info {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 1px;
              }
              .file-item-name {
                font-size: 13px;
                font-weight: 500;
                color: var(--text-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .file-item-meta {
                font-size: 11px;
                color: var(--text-muted);
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .spin {
                animation: spin 1s linear infinite;
              }
            `}</style>
          </div>
        )
      })}

      <style>{`
        .file-list {
          flex: 1;
          overflow-y: auto;
          padding: 4px 8px;
        }
      `}</style>
    </div>
  )
}

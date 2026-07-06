import { useInvoiceStore } from '../store/invoiceStore.js'
import { getFieldSchema, DOCUMENT_TYPES } from '../data/schemas.js'
import { formatFieldValue } from '../utils/formatHelper.js'
import InvoiceCard from './InvoiceCard.jsx'
import PreviewPanel from './PreviewPanel.jsx'
import { FileSearch } from 'lucide-react'

export default function DetailPanel() {
  const selectedUid = useInvoiceStore(s => s.selectedUid)
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)

  const entry = entries.find(e => e.uid === selectedUid)
  const result = selectedUid ? results[selectedUid] : null

  if (!entry) {
    return (
      <div className="detail-empty">
        <FileSearch size="48" opacity="0.3" />
        <p>Select a document to inspect</p>
      </div>
    )
  }

  const documentType = result?.documentType || 'unknown'
  const typeInfo = DOCUMENT_TYPES[documentType] || { label: result?.documentLabel || 'Unknown' }
  const schema = getFieldSchema(documentType)

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-title">
          <h2>{entry.fileName}</h2>
          <span className="detail-badge">{typeInfo.label}</span>
          {result && (
            <span className={`detail-confidence ${result.confidence >= 0.7 ? 'high' : result.confidence >= 0.4 ? 'medium' : 'low'}`}>
              {Math.round(result.confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>
      <div className="detail-body">
        <PreviewPanel file={entry} />
        {result && <InvoiceCard fields={result.fields} schema={schema} uid={selectedUid} />}
      </div>

      <style>{`
        .detail-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          gap: 12px;
        }
        .detail-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .detail-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--card-bg);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }
        .detail-title {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .detail-title h2 {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 320px;
        }
        .detail-badge {
          padding: 2px 8px;
          background: var(--primary-light);
          color: var(--primary-hover);
          font-size: 11px;
          font-weight: 600;
          border-radius: 100px;
        }
        .detail-confidence {
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 500;
          border-radius: 100px;
        }
        .detail-confidence.high { background: #E8F5E9; color: #2E7D32; }
        .detail-confidence.medium { background: #FFF3E0; color: #E65100; }
        .detail-confidence.low { background: #FFEBEE; color: #C62828; }
        .detail-body {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px 0;
        }
      `}</style>
    </div>
  )
}

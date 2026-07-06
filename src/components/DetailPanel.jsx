import { useState } from 'react'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { getFieldSchema, DOCUMENT_TYPES } from '../data/schemas.js'
import InvoiceCard from './InvoiceCard.jsx'
import PreviewPanel from './PreviewPanel.jsx'
import parserFactory from '../core/parser/index.js'
import { FileSearch, AlertTriangle } from 'lucide-react'

const TYPE_OPTIONS = [
  { id: 'common_invoice', label: 'Value-Added Tax Invoice' },
  { id: 'train_ticket', label: 'Train Ticket' },
  { id: 'flight_ticket', label: 'Flight Itinerary' },
  { id: 'vehicle_invoice', label: 'Vehicle Invoice' },
  { id: 'taxi_invoice', label: 'Taxi Receipt' },
  { id: 'fixed_amount', label: 'Fixed-Amount Receipt' },
  { id: 'toll_invoice', label: 'Toll Invoice' }
]

export default function DetailPanel() {
  const selectedUid = useInvoiceStore(s => s.selectedUid)
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const setDocumentType = useInvoiceStore(s => s.setDocumentType)

  const [typeSelecting, setTypeSelecting] = useState(false)

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
  const typeInfo = DOCUMENT_TYPES[documentType] || { label: result?.documentLabel || 'Unknown Document' }
  const schema = getFieldSchema(documentType)
  const needsTypeSelection = !result || result.confidence < 0.4 || documentType === 'unknown'

  const handleTypeChange = (typeId) => {
    const parsed = parserFactory.parseWithType(result.rawText || '', typeId)
    if (parsed) {
      setDocumentType(selectedUid, typeId, parsed)
    }
    setTypeSelecting(false)
  }

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

      {needsTypeSelection && result && (
        <div className="type-selector-bar">
          <AlertTriangle size="14" />
          <span>Auto-detection was uncertain. Select the correct document type:</span>
          <select
            className="type-select"
            value={documentType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="" disabled>Choose type...</option>
            {TYPE_OPTIONS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

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

        .type-selector-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #FFF8E1;
          border-bottom: 1px solid #FFE082;
          font-size: 12px;
          color: #F57F17;
          flex-wrap: wrap;
        }
        .type-select {
          padding: 4px 8px;
          border: 1px solid #FFE082;
          border-radius: var(--radius-sm);
          background: #fff;
          font-size: 12px;
          color: var(--text-primary);
          cursor: pointer;
        }
        .type-select:focus {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }

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

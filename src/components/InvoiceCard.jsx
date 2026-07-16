import { useTranslation } from 'react-i18next'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { formatFieldValue, normalizeFieldValue } from '../utils/formatHelper.js'
import { Pencil } from 'lucide-react'

export default function InvoiceCard({ fields, schema, uid }) {
  const { t } = useTranslation()
  const updateField = useInvoiceStore(s => s.updateField)

  const handleEdit = (key, currentValue) => {
    const newVal = window.prompt(t('invoiceCard.editPrompt'), currentValue)
    if (newVal !== null && newVal !== currentValue) {
      updateField(uid, key, newVal)
    }
  }

  if (!fields || Object.keys(fields).length === 0) {
    return (
      <div className="invoice-card card">
        <div className="invoice-card-empty">{t('invoiceCard.empty')}</div>
      </div>
    )
  }

  // Use schema order if available, otherwise use field insertion order
  const orderedKeys = schema
    ? schema.filter(s => fields[s.key]).map(s => s.key)
    : Object.keys(fields)

  return (
    <div className="invoice-card card">
      <div className="invoice-card-header">
        <h3>{t('invoiceCard.title')}</h3>
        <span className="invoice-card-hint">{t('invoiceCard.hint')}</span>
      </div>
      <div className="invoice-fields">
        {orderedKeys.map(key => {
          const field = fields[key]
          if (!field) return null
          const schemaField = schema?.find(s => s.key === key)
          const normalizedField = normalizeFieldValue(field, schemaField)
          const displayValue = formatFieldValue(normalizedField.numeric ?? normalizedField.value, schemaField?.type || 'text')
          const confidence = field.confidence
          const isLowConfidence = confidence !== undefined && confidence < 0.6

          return (
            <div key={key} className="field-row">
              <span className="field-label">{field.label}</span>
              <div className="field-value-area">
                <span
                  className={`field-value${isLowConfidence ? ' field-confidence-low' : ''}`}
                  onClick={() => handleEdit(key, field.value)}
                  title={isLowConfidence ? `${t('invoiceCard.confidence')}: ${(confidence * 100).toFixed(0)}%` : t('invoiceCard.hint')}
                >
                  {displayValue}
                  {isLowConfidence && <span className="confidence-dot" />}
                  <Pencil size="12" className="field-edit-icon" />
                </span>
                {isLowConfidence && (
                  <div className="confidence-bar-track">
                    <div className="confidence-bar-fill" style={{ width: `${confidence * 100}%` }} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .invoice-card {
          margin: 0 16px;
          overflow: hidden;
        }
        .invoice-card-empty {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
        }
        .invoice-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px 0;
        }
        .invoice-card-header h3 {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .invoice-card-hint {
          font-size: 11px;
          color: var(--text-muted);
        }
        .invoice-fields {
          padding: 8px 16px 16px;
        }
        .field-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #F0F0F0;
          gap: 16px;
        }
        .field-row:last-child {
          border-bottom: none;
        }
        .field-label {
          font-size: 12px;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .field-value {
          font-size: 13px;
          color: var(--text-primary);
          font-weight: 500;
          text-align: right;
          word-break: break-all;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color var(--transition);
        }
        .field-value:hover {
          color: var(--primary);
        }
        .field-edit-icon {
          opacity: 0;
          transition: opacity var(--transition);
          flex-shrink: 0;
        }
        .field-value:hover .field-edit-icon {
          opacity: 0.5;
        }
        .field-value-area {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .field-confidence-low {
          font-weight: 400;
        }
        .field-confidence-low .confidence-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .confidence-bar-track {
          width: 100%;
          height: 3px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }
        .confidence-bar-fill {
          height: 100%;
          background: #f59e0b;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  )
}

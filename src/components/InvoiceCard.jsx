import { useInvoiceStore } from '../store/invoiceStore.js'
import { formatFieldValue } from '../utils/formatHelper.js'
import { Pencil } from 'lucide-react'

export default function InvoiceCard({ fields, schema, uid }) {
  const updateField = useInvoiceStore(s => s.updateField)

  const handleEdit = (key, currentValue) => {
    const newVal = window.prompt('Edit value:', currentValue)
    if (newVal !== null && newVal !== currentValue) {
      updateField(uid, key, newVal)
    }
  }

  if (!fields || Object.keys(fields).length === 0) {
    return (
      <div className="invoice-card card">
        <div className="invoice-card-empty">No structured fields extracted for this document.</div>
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
        <h3>Extracted Fields</h3>
        <span className="invoice-card-hint">Click a value to edit</span>
      </div>
      <div className="invoice-fields">
        {orderedKeys.map(key => {
          const field = fields[key]
          if (!field) return null
          const schemaField = schema?.find(s => s.key === key)
          const displayValue = formatFieldValue(field.value, schemaField?.type || 'text')

          return (
            <div key={key} className="field-row">
              <span className="field-label">{field.label}</span>
              <span
                className="field-value"
                onClick={() => handleEdit(key, field.value)}
                title="Click to edit"
              >
                {displayValue}
                <Pencil size="12" className="field-edit-icon" />
              </span>
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
      `}</style>
    </div>
  )
}

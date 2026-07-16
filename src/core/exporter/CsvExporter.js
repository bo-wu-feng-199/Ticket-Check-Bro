/**
 * CsvExporter — Export parsed invoice data to CSV.
 */
import { getFieldSchema, DOCUMENT_TYPES } from '../../data/schemas.js'

export function exportToCsv(entries, results, filename = 'ticket-check-bro-export.csv') {
  const parsed = entries.filter(e => e.status === 'parsed' && results[e.uid])
  if (parsed.length === 0) { alert('No parsed documents to export.'); return }

  const headers = ['File Name', 'Document Type', 'Confidence']
  let schemaKeys = []
  for (const entry of parsed) {
    const schema = getFieldSchema(results[entry.uid].documentType)
    schema.forEach(s => {
      if (!headers.includes(s.label)) { headers.push(s.label); schemaKeys.push(s.key) }
    })
  }

  const rows = parsed.map(entry => {
    const result = results[entry.uid]
    const fields = result.fields
    const typeLabel = DOCUMENT_TYPES[result.documentType]?.label || result.documentLabel || 'Unknown'
    const row = [entry.fileName, typeLabel, `${Math.round(result.confidence * 100)}%`]
    schemaKeys.forEach(key => {
      const fv = fields[key]
      row.push(fv ? String(fv.value) : '')
    })
    return row
  })

  let csv = headers.map(h => `"${h}"`).join(',') + '\n'
  rows.forEach(row => {
    csv += row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

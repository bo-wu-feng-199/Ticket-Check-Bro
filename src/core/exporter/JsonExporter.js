/**
 * JsonExporter — Export parsed invoice data as JSON.
 */
import { DOCUMENT_TYPES } from '../../data/schemas.js'

export function exportToJson(entries, results, filename = 'ticket-check-bro-export.json') {
  const parsed = entries.filter(e => e.status === 'parsed' && results[e.uid])
  if (parsed.length === 0) { alert('No parsed documents to export.'); return }

  const data = parsed.map(entry => {
    const result = results[entry.uid]
    const typeLabel = DOCUMENT_TYPES[result.documentType]?.label || result.documentLabel || 'Unknown'
    const fields = {}
    Object.entries(result.fields || {}).forEach(([key, fv]) => {
      fields[key] = { label: fv.label, value: fv.value }
    })
    return { fileName: entry.fileName, documentType: typeLabel, confidence: result.confidence, fields }
  })

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

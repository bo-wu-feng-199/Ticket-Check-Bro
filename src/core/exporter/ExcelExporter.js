/**
 * ExcelExporter — Generates a unified spreadsheet from parsed document data using SheetJS.
 *
 * Outputs a single .xlsx workbook with:
 *   - Sheet 1: All documents with their extracted fields in a flat table
 *   - Column widths optimized for readability
 *   - Header row styled with bold text
 */

import * as XLSX from 'xlsx'
import { getFieldSchema, DOCUMENT_TYPES } from '../../data/schemas.js'
import { detectDuplicates } from '../deduplicator.js'

/**
 * Export parsed invoice data to a .xlsx file and trigger download.
 *
 * @param {Array} entries - File entries array from store
 * @param {Object} results - Parsed results keyed by uid
 * @param {string} [filename='ticket-check-bro-export.xlsx']
 */
export function exportToExcel(entries, results, filename = 'ticket-check-bro-export.xlsx') {
  // Filter to only parsed entries
  const parsed = entries.filter(e => e.status === 'parsed' && results[e.uid])

  if (parsed.length === 0) {
    alert('No parsed documents to export.')
    return
  }

  // Detect duplicates to highlight in yellow
  const { duplicates: duplicateUids } = detectDuplicates(results)

  // Build rows for the spreadsheet
  const rows = parsed.map(entry => {
    const result = results[entry.uid]
    const schema = getFieldSchema(result.documentType)
    const fields = result.fields
    const typeLabel = DOCUMENT_TYPES[result.documentType]?.label || result.documentLabel || 'Unknown'

    const row = {
      'File Name': entry.fileName,
      'Document Type': typeLabel,
      'Confidence': `${Math.round(result.confidence * 100)}%`
    }

    // Add schema fields
    for (const field of schema) {
      const fv = fields[field.key]
      if (fv) {
        // Use numeric value for currency fields so Excel treats them as numbers
        row[field.label] = fv.numeric !== undefined ? fv.numeric : String(fv.value)
      } else {
        row[field.label] = ''
      }
    }

    return row
  })

  // Create workbook
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto column widths
  const colWidths = Object.keys(rows[0]).map(key => {
    const maxLen = Math.max(
      key.length,
      ...rows.map(r => String(r[key] || '').length)
    )
    return { wch: Math.min(Math.max(maxLen + 2, 12), 40) }
  })
  ws['!cols'] = colWidths

  // Highlight duplicate rows in yellow
  if (duplicateUids.length > 0) {
    const headerKeys = Object.keys(rows[0])
    parsed.forEach((entry, rowIdx) => {
      if (!duplicateUids.includes(entry.uid)) return
      const excelRow = rowIdx + 2 // 1-based, +1 for header
      headerKeys.forEach((key, colIdx) => {
        const cellAddr = XLSX.utils.encode_cell({ r: excelRow - 1, c: colIdx })
        if (!ws[cellAddr]) return
        ws[cellAddr].s = {
          fill: { fgColor: { rgb: 'FFFF00' } },
          font: { color: { rgb: '000000' } }
        }
      })
    })
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Documents')

  // Generate and download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

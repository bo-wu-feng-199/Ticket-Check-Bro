/**
 * PdfMerger — merge multiple PDF files into a single downloadable PDF.
 *
 * Uses pdf-lib (pure-JS, zero-server) to read each PDF, copy all pages
 * into one document, and trigger a browser download.
 *
 * Dependencies:
 *   - pdf-lib ^1.17.1 (npm)
 *   - fileRefs.js (for raw File object access)
 */

import { PDFDocument } from 'pdf-lib'
import { getFile } from '../../store/fileRefs.js'

/**
 * Merge all PDF entries into a single PDF and trigger download.
 *
 * @param {Array} entries  - Zustand store entries (in display order)
 * @returns {Promise<{mergedCount: number, totalPages: number}>}
 */
export async function mergePdfs(entries) {
  // ── 1. Filter to PDF-only, parsed entries ──
  const pdfEntries = entries.filter(e =>
    e.mimeType === 'application/pdf' || /\.pdf$/i.test(e.fileName)
  )

  if (pdfEntries.length < 2) {
    alert(`Need at least 2 PDF files to merge. Found only ${pdfEntries.length}.`)
    return { mergedCount: 0, totalPages: 0 }
  }

  // ── 2. Read each PDF via pdf-lib ──
  const srcDocPromises = pdfEntries.map(async (entry) => {
    const file = getFile(entry.uid)
    if (!file) throw new Error(`File not found for: ${entry.fileName}`)
    const arrayBuffer = await file.arrayBuffer()
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    return { entry, srcDoc }
  })

  const srcDocs = await Promise.all(srcDocPromises)

  // ── 3. Merge into one document ──
  const mergedPdf = await PDFDocument.create()

  // Add metadata
  mergedPdf.setTitle('Merged Documents — Ticket-Check-Bro')
  mergedPdf.setProducer('Ticket-Check-Bro v1.1.0')
  mergedPdf.setCreator('Ticket-Check-Bro — pdf-lib')

  let totalPages = 0

  for (const { entry, srcDoc } of srcDocs) {
    const pageIndices = srcDoc.getPageIndices()
    const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices)

    for (const page of copiedPages) {
      mergedPdf.addPage(page)
    }
    totalPages += pageIndices.length
  }

  // ── 4. Generate and download ──
  const mergedBytes = await mergedPdf.save()
  const blob = new Blob([mergedBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `merged-documents-${timestamp}.pdf`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // Release blob URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 2000)

  // ── 5. Return stats ──
  const mergedCount = srcDocs.length
  console.log(
    `[PdfMerger] Merged ${mergedCount} PDFs → ${filename} (${totalPages} pages)`
  )

  return { mergedCount, totalPages }
}

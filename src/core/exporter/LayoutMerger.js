/**
 * LayoutMerger — arrange multiple invoice PDFs into a grid on A4 pages.
 *
 * Unlike PdfMerger (sequential page concatenation), this module takes the
 * FIRST page of every selected PDF, scales it to fit a grid cell, and places
 * the scaled pages into a grid (e.g. 2×2, 3×3) on A4 output pages. Vector
 * content is preserved because pdf-lib draws the original page objects.
 */

import { PDFDocument, PageSizes } from 'pdf-lib'
import { getFile } from '../../store/fileRefs.js'

const A4 = PageSizes.A4 // [595.28, 841.89] width x height

// Layout presets: label → [cols, rows] (grid of cells per A4 page)
export const LAYOUT_PRESETS = [
  { id: '1x1', cols: 1, rows: 1, label: '1 × 1' },
  { id: '2x1', cols: 2, rows: 1, label: '2 × 1' },
  { id: '2x2', cols: 2, rows: 2, label: '2 × 2' },
  { id: '3x2', cols: 3, rows: 2, label: '3 × 2' },
  { id: '3x3', cols: 3, rows: 3, label: '3 × 3' },
  { id: '4x3', cols: 4, rows: 3, label: '4 × 3' },
  { id: '4x4', cols: 4, rows: 4, label: '4 × 4' }
]

export async function layoutMergePdfs(entries, layoutId) {
  // Filter PDF entries
  const pdfEntries = entries.filter(e =>
    e.mimeType === 'application/pdf' || /\.pdf$/i.test(e.fileName)
  )
  if (pdfEntries.length === 0) {
    alert('No PDF files to merge.')
    return { mergedCount: 0, totalPages: 0 }
  }

  const layout = LAYOUT_PRESETS.find(p => p.id === layoutId) || LAYOUT_PRESETS[2]
  const cellsPerPage = layout.cols * layout.rows

  // Read all source docs
  const srcDocs = await Promise.all(pdfEntries.map(async (entry) => {
    const file = getFile(entry.uid)
    if (!file) throw new Error(`File not found for: ${entry.fileName}`)
    const arrayBuffer = await file.arrayBuffer()
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    return { entry, srcDoc }
  }))

  const out = await PDFDocument.create()
  out.setTitle('Layout Merged Invoices — Ticket-Check-Bro')
  out.setProducer('Ticket-Check-Bro')

  const [pageW, pageH] = A4
  // Margins (points)
  const marginX = 24
  const marginY = 24
  const gapX = 12
  const gapY = 12
  const cellW = (pageW - marginX * 2 - gapX * (layout.cols - 1)) / layout.cols
  const cellH = (pageH - marginY * 2 - gapY * (layout.rows - 1)) / layout.rows

  // Track index across all source pages (each invoice contributes its FIRST page only)
  let pageIndex = 0

  while (pageIndex < srcDocs.length) {
    // Create a new A4 page for this batch of cells
    const page = out.addPage(A4)

    for (let i = 0; i < cellsPerPage && pageIndex < srcDocs.length; i++, pageIndex++) {
      const { srcDoc } = srcDocs[pageIndex]
      if (srcDoc.getPageCount() === 0) continue

      // Copy first page of the source doc
      const [srcPage] = await out.copyPages(srcDoc, [0])

      // Compute cell placement
      const col = i % layout.cols
      const row = Math.floor(i / layout.cols)
      const x = marginX + col * (cellW + gapX)
      // y from top: pdf-lib y=0 is bottom, so compute from top
      const y = pageH - marginY - (row + 1) * cellH - row * gapY

      // Scale page to fit cell while preserving aspect ratio
      const srcW = srcPage.getWidth()
      const srcH = srcPage.getHeight()
      const scale = Math.min(cellW / srcW, cellH / srcH)
      const drawW = srcW * scale
      const drawH = srcH * scale
      // Center within cell
      const drawX = x + (cellW - drawW) / 2
      const drawY = y + (cellH - drawH) / 2

      page.drawPage(srcPage, { x: drawX, y: drawY, width: drawW, height: drawH })
    }
  }

  const bytes = await out.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `layout-merged-invoices-${timestamp}.pdf`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)

  return { mergedCount: srcDocs.length, totalPages: Math.ceil(srcDocs.length / cellsPerPage), blob }
}

/**
 * Print a generated layout PDF blob in a new window/tab.
 * Opens the blob in a hidden iframe and calls print().
 * @param {Blob} blob - PDF blob from layoutMergePdfs
 */
export function printBlob(blob) {
  const url = URL.createObjectURL(blob)
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.src = url
  document.body.appendChild(iframe)
  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
      } catch (err) {
        console.error('Print failed:', err)
      }
    }, 300)
  }
  setTimeout(() => {
    document.body.removeChild(iframe)
    URL.revokeObjectURL(url)
  }, 120000)
}

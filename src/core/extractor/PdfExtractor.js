/**
 * PdfExtractor — Extracts text content from PDF files using pdfjs-dist.
 *
 * Uses Mozilla's pdf.js library compiled to WebAssembly to parse PDF
 * documents entirely in the browser. No server-side processing needed.
 */

import * as pdfjsLib from 'pdfjs-dist'

// Configure pdfjs worker once (global singleton — affects all importers)
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()
}

export { pdfjsLib }

/**
 * Extract text content from a PDF File object.
 * Reads all pages to ensure no data is missed.
 *
 * @param {File} file - PDF File object
 * @returns {Promise<string>} Extracted text content
 */
export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pageCount = pdf.numPages
  const pages = []

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map(item => item.str).join(' ')
    pages.push(text)
  }

  return pages.join('\n\n')
}

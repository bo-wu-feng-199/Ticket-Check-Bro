/**
 * ExtractorScheduler — Routes files to the appropriate extraction pipeline
 * (PDF text extraction or image OCR) based on file type.
 */

import { extractPdfText } from './PdfExtractor.js'
import { recognizeImage } from './ImageExtractor.js'

/**
 * Extract text content from a file using the appropriate pipeline.
 *
 * @param {File} file - File object (PDF or image)
 * @param {'pdf'|'image'} method - Extraction method
 * @param {Function} [onProgress] - Progress callback for OCR
 * @returns {Promise<string>} Extracted text
 */
export async function extractText(file, method, onProgress) {
  switch (method) {
    case 'pdf':
      return await extractPdfText(file)
    case 'image':
      return await recognizeImage(file, onProgress)
    default:
      throw new Error(`Unknown extraction method: ${method}`)
  }
}

/**
 * ImageExtractor — Performs OCR on image files using Tesseract.js.
 *
 * Tesseract.js runs Tesseract OCR engine compiled to WebAssembly,
 * executing entirely in the browser. The language pack is loaded
 * on demand (Chinese Simplified + English for invoice text).
 *
 * Progress callbacks allow the UI to show real-time OCR status.
 *
 * @typedef {Object} OcrProgress
 * @property {string} status - Current OCR status ('loading tesseract core'|'initializing tesseract'|'recognizing text')
 * @property {number} progress - Progress percentage (0–1)
 */

let worker = null

/**
 * Get or create the singleton Tesseract worker.
 * Lazily initializes to avoid loading the WASM bundle on page load.
 */
async function getWorker(onProgress) {
  if (worker) return worker

  const Tesseract = await import('tesseract.js')

  worker = await Tesseract.createWorker({
    logger: (m) => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress({ status: m.status, progress: m.progress })
      }
    }
  })

  // Load Chinese Simplified + English for invoice text
  await worker.loadLanguage('chi_sim+eng')
  await worker.initialize('chi_sim+eng')

  return worker
}

/**
 * Perform OCR on an image File and return recognized text.
 *
 * @param {File} file - Image File object (JPEG, PNG)
 * @param {Function} [onProgress] - Progress callback receiving { status, progress }
 * @returns {Promise<string>} Recognized text
 */
export async function recognizeImage(file, onProgress) {
  const w = await getWorker(onProgress)

  // Convert File to image data URL
  const imageUrl = URL.createObjectURL(file)

  try {
    const { data } = await w.recognize(imageUrl)
    return data.text
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

/**
 * Clean up the OCR worker. Call when the app unmounts.
 */
export async function terminateOcr() {
  if (worker) {
    await worker.terminate()
    worker = null
  }
}

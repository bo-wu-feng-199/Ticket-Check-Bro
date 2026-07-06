/**
 * useFileManager — Custom hook wrapping file management operations from the store.
 *
 * Provides a clean API for adding files with validation, removing files,
 * sorting, and clearing. Integrates with the extraction pipeline.
 */

import { useCallback } from 'react'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { isAllowedType, isWithinSizeLimit, getExtractionMethod, uid, formatFileSize } from '../utils/fileHelper.js'
import { extractText } from '../core/extractor/index.js'
import parserFactory from '../core/parser/index.js'

export function useFileManager() {
  const addEntries = useInvoiceStore(s => s.addEntries)
  const updateEntryStatus = useInvoiceStore(s => s.updateEntryStatus)
  const setResult = useInvoiceStore(s => s.setResult)
  const setParseError = useInvoiceStore(s => s.setParseError)

  const addFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList)
    const validEntries = []

    // Validate and create entries
    for (const file of files) {
      if (!isAllowedType(file)) {
        console.warn(`Unsupported file type: ${file.name}`)
        continue
      }
      if (!isWithinSizeLimit(file)) {
        console.warn(`File too large: ${file.name} (${formatFileSize(file.size)})`)
        continue
      }

      validEntries.push({
        file,
        uid: uid(),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      })
    }

    if (validEntries.length === 0) return

    // Add entries to store with "parsing" status
    const storeEntries = validEntries.map(e => ({
      uid: e.uid,
      fileName: e.fileName,
      fileSize: e.fileSize,
      mimeType: e.mimeType,
      previewUrl: e.mimeType.startsWith('image/') ? URL.createObjectURL(e.file) : null,
      status: 'parsing',
      error: null
    }))

    addEntries(storeEntries)

    // Process each file asynchronously
    for (const entry of validEntries) {
      try {
        const method = getExtractionMethod(entry.file)

        // Extract text
        const rawText = await extractText(entry.file, method, (progress) => {
          // OCR progress updates could be stored in a ref if needed
        })

        // Parse with factory
        const result = parserFactory.analyze(rawText)

        if (result && result.confidence >= 0.3) {
          setResult(entry.uid, {
            ...result,
            rawText: rawText.substring(0, 2000) // Store first 2000 chars for reference
          })
        } else {
          // Low confidence — store raw text and mark as parsed with minimal info
          setResult(entry.uid, {
            documentType: 'unknown',
            documentLabel: 'Unknown Document',
            confidence: 0,
            fields: {
              rawContent: { label: 'Extracted Text', value: rawText.substring(0, 500) }
            },
            rawText: rawText.substring(0, 2000)
          })
        }
      } catch (err) {
        console.error(`Parse failed for ${entry.fileName}:`, err)
        setParseError(entry.uid, err.message || 'Extraction failed')
      }
    }
  }, [addEntries, updateEntryStatus, setResult, setParseError])

  return { addFiles }
}

/**
 * useStats — Computes derived statistics from the store state.
 */

import { useMemo } from 'react'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { detectDuplicates } from '../core/deduplicator.js'

export function useStats() {
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)

  return useMemo(() => {
    const parsed = entries.filter(e => e.status === 'parsed')
    const pending = entries.filter(e => e.status === 'parsing')
    const failed = entries.filter(e => e.status === 'failed')

    const totalAmount = parsed.reduce((sum, e) => {
      const f = results[e.uid]?.fields
      if (!f) return sum
      const val = parseFloat(f.totalAmount?.value || f.amount?.value || 0)
      return sum + (isNaN(val) ? 0 : val)
    }, 0)

    // Document type breakdown
    const docTypeCount = {}
    parsed.forEach(e => {
      const dt = results[e.uid]?.documentType || 'unknown'
      docTypeCount[dt] = (docTypeCount[dt] || 0) + 1
    })
    const documentTypeBreakdown = Object.entries(docTypeCount)
      .map(([type, count]) => `${type}: ${count}`)
      .join(', ')

    const dupInfo = detectDuplicates(results)

    return {
      totalFiles: entries.length,
      parsedCount: parsed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      totalAmount,
      duplicateCount: dupInfo.duplicateCount,
      documentTypeBreakdown
    }
  }, [entries, results])
}

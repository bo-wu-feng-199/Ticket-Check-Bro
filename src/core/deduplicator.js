/**
 * Deduplicator — Detects duplicate documents using content-aware fingerprinting.
 *
 * Strategy: Compare extracted field values (invoice code + invoice number)
 * as the primary dedup key. Falls back to filename similarity if fields are empty.
 */

/**
 * Generate a fingerprint for a parsed result.
 * @param {Object} result - Parsed document result
 * @returns {string} Fingerprint hash
 */
function fingerprint(result) {
  const fields = result.fields || {}
  const code = fields.invoiceCode?.value || ''
  const number = fields.invoiceNumber?.value || ''
  const total = fields.totalAmount?.value || fields.amount?.value || ''

  // Primary: invoice code + number (most reliable)
  if (code && number) return `${code}_${number}`
  // Fallback: number + amount
  if (number && total) return `${number}_${total}`
  // Last resort: amount only (weak)
  return total || ''
}

/**
 * Check for duplicates among parsed results.
 *
 * @param {Object} results - Parsed results keyed by uid
 * @returns {Object} { duplicates: string[], duplicateCount: number }
 *   duplicates: array of uid values that are duplicates
 *   duplicateCount: number of duplicate groups
 */
export function detectDuplicates(results) {
  const fingerprintMap = new Map()
  const duplicates = new Set()

  for (const [uid, result] of Object.entries(results)) {
    const fp = fingerprint(result)
    if (!fp) continue

    if (fingerprintMap.has(fp)) {
      duplicates.add(uid)
      duplicates.add(fingerprintMap.get(fp))
    } else {
      fingerprintMap.set(fp, uid)
    }
  }

  return {
    duplicates: [...duplicates],
    duplicateCount: duplicates.size
  }
}

/**
 * Check if a specific uid is a duplicate.
 */
export function isDuplicate(uid, results) {
  const { duplicates } = detectDuplicates(results)
  return duplicates.includes(uid)
}

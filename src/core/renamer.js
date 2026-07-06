/**
 * Renamer — Template-driven file renaming using extracted document fields.
 *
 * Template syntax: {fieldKey} — replaced with the corresponding field value.
 * Example template: "{type}-{buyerName}-{totalAmount}"
 *
 * Allowed field keys: invoiceCode, invoiceNumber, issueDate, buyerName,
 *                     sellerName, totalAmount, amount, type, etc.
 */

import { sanitizeFilename } from '../utils/formatHelper.js'
import { DOCUMENT_TYPES } from '../data/schemas.js'

/**
 * Generate a new filename based on a template and parsed fields.
 *
 * @param {string} template - Rename template, e.g. "{type}-{buyerName}-{amount}"
 * @param {Object} result - Parsed result with fields
 * @param {string} originalExt - Original file extension including dot, e.g. ".pdf"
 * @returns {string} New filename with extension
 */
export function generateFilename(template, result, originalExt) {
  const fields = result.fields || {}
  const typeLabel = DOCUMENT_TYPES[result.documentType]?.label || result.documentLabel || 'Unknown'

  const replacements = {
    type: typeLabel,
    documentType: typeLabel
  }

  // Add all field values as replacements
  for (const [key, field] of Object.entries(fields)) {
    replacements[key] = field.value || ''
  }

  // Apply template
  let newName = template.replace(/\{(\w+)\}/g, (_, key) => {
    return replacements[key] || `{${key}}`
  })

  // Clean up
  newName = sanitizeFilename(newName)

  return `${newName}${originalExt}`
}

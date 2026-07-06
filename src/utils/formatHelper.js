/**
 * Formatting utilities for displaying and exporting data.
 */

/**
 * Format a number as currency string.
 */
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '—'
  return `¥${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * Format a date string for display.
 */
export function formatDate(value) {
  if (!value) return '—'
  // Already formatted or ISO-like
  if (/^\d{4}[\/-]\d{2}[\/-]\d{2}/.test(value)) return value
  return value
}

/**
 * Format a field value by its type.
 */
export function formatFieldValue(value, type) {
  if (value == null || value === '') return '—'
  switch (type) {
    case 'currency':
      return formatCurrency(value)
    case 'date':
      return formatDate(value)
    default:
      return String(value)
  }
}

/**
 * Sanitize a string for use in filenames.
 */
export function sanitizeFilename(str) {
  return String(str)
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 64)
}

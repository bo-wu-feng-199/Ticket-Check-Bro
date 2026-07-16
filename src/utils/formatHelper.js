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
 * Normalize a field object by schema type, adding numeric and currency info for currency fields.
 * @param {Object} field - The field object { label, value, ... }
 * @param {Object} schemaField - The schema definition { key, label, type }
 * @returns {Object} The normalized field object
 */
export function normalizeFieldValue(field, schemaField) {
  if (schemaField?.type === 'currency') {
    const numeric = typeof field.value === 'number'
      ? field.value
      : (parseFloat(field.value) || 0)
    return { ...field, numeric, currency: 'CNY' }
  }
  return field
}

/**
 * Format a field value by its type.
 */
export function formatFieldValue(value, type) {
  if (value == null || value === '') return '—'
  switch (type) {
    case 'currency': {
      const num = typeof value === 'number' ? value : parseFloat(value)
      if (isNaN(num)) return '—'
      return formatCurrency(num)
    }
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

/**
 * File type detection and validation utilities.
 */

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png'
]

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

/**
 * Check if a File object is an allowed type.
 */
export function isAllowedType(file) {
  if (ALLOWED_TYPES.includes(file.type)) return true
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

/**
 * Check if file size is within limits.
 */
export function isWithinSizeLimit(file) {
  return file.size <= MAX_FILE_SIZE
}

/**
 * Determine extraction method based on MIME type.
 * Returns 'pdf' | 'image'
 */
export function getExtractionMethod(file) {
  if (file.type === 'application/pdf') return 'pdf'
  return 'image'
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Generate a unique identifier.
 */
export function uid() {
  return 'xxxxxxxxxxxx'.replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  )
}

export { ALLOWED_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE }

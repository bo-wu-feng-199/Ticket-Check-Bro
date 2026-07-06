/**
 * FileRefs — holds references to original File objects outside the Zustand store.
 *
 * Zustand is not designed for non-serializable values like File/Blob objects.
 * This module keeps File references in a plain Map so PreviewPanel can access
 * the original file for PDF rendering via pdfjs-dist.
 *
 * IMPORTANT: Always call removeFile / clearAll when entries are deleted to
 * prevent memory leaks from retained File references.
 */

const _fileMap = new Map()

export function setFile(uid, file) { _fileMap.set(uid, file) }
export function getFile(uid) { return _fileMap.get(uid) || null }
export function removeFile(uid) { _fileMap.delete(uid) }
export function clearFiles() { _fileMap.clear() }

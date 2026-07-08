import { useEffect } from 'react'
import { useInvoiceStore } from '../store/invoiceStore.js'

export function useKeyboardShortcuts() {
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const selectedUids = useInvoiceStore(s => s.selectedUids)
  const selectEntry = useInvoiceStore(s => s.selectEntry)
  const batchRemove = useInvoiceStore(s => s.batchRemove)

  useEffect(() => {
    const handler = (e) => {
      // Ctrl+O: open file dialog
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault()
        document.querySelector('input[type="file"]')?.click()
      }
      // Delete/Backspace: remove selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedUids.length > 0) {
        e.preventDefault()
        if (confirm(`Delete ${selectedUids.length} file(s)?`)) batchRemove()
      }
      // Ctrl+E: export Excel
      if (e.ctrlKey && e.key === 'e') {
        const parsed = entries.filter(e => e.status === 'parsed')
        if (parsed.length > 0) {
          e.preventDefault()
          document.querySelector('.btn-export')?.click()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [entries, results, selectedUids, batchRemove])
}

import { create } from 'zustand'

const initialState = {
  entries: [],
  results: {},
  selectedUid: null,
  config: {
    mergeLayout: '2x2',
    orientation: 'landscape',
    duplicateCopy: false,
    renameTemplate: '{type}-{buyerName}-{amount}'
  }
}

export const useInvoiceStore = create((set, get) => ({
  ...initialState,

  // ── File management ──

  addEntries: (newEntries) =>
    set(state => ({
      entries: [...state.entries, ...newEntries]
    })),

  removeEntry: (uid) =>
    set(state => {
      const entry = state.entries.find(e => e.uid === uid)
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl)
      return {
        entries: state.entries.filter(e => e.uid !== uid),
        results: (() => { const r = { ...state.results }; delete r[uid]; return r })(),
        selectedUid: state.selectedUid === uid ? null : state.selectedUid
      }
    }),

  clearAll: () =>
    set(state => {
      state.entries.forEach(e => { if (e.previewUrl) URL.revokeObjectURL(e.previewUrl) })
      return { entries: [], results: {}, selectedUid: null }
    }),

  moveEntry: (fromIndex, toIndex) =>
    set(state => {
      const entries = [...state.entries]
      const [moved] = entries.splice(fromIndex, 1)
      entries.splice(toIndex, 0, moved)
      return { entries }
    }),

  updateEntryStatus: (uid, status, error = null) =>
    set(state => ({
      entries: state.entries.map(e =>
        e.uid === uid ? { ...e, status, error } : e
      )
    })),

  selectEntry: (uid) =>
    set({ selectedUid: uid }),

  // ── Parse results ──

  setResult: (uid, result) =>
    set(state => ({
      results: { ...state.results, [uid]: result },
      entries: state.entries.map(e =>
        e.uid === uid ? { ...e, status: 'parsed' } : e
      )
    })),

  setParseError: (uid, error) =>
    set(state => ({
      entries: state.entries.map(e =>
        e.uid === uid ? { ...e, status: 'failed', error } : e
      )
    })),

  updateField: (uid, fieldKey, value) =>
    set(state => {
      const result = state.results[uid]
      if (!result || !result.fields[fieldKey]) return state
      return {
        results: {
          ...state.results,
          [uid]: {
            ...result,
            fields: {
              ...result.fields,
              [fieldKey]: { ...result.fields[fieldKey], value }
            }
          }
        }
      }
    }),

  // ── Config ──

  updateConfig: (patch) =>
    set(state => ({
      config: { ...state.config, ...patch }
    })),

  // ── Computed ──

  getStats: () => {
    const { entries, results } = get()
    const parsed = entries.filter(e => e.status === 'parsed')
    const totalAmount = parsed.reduce((sum, e) => {
      const result = results[e.uid]
      if (!result || !result.fields.totalAmount) return sum
      const val = parseFloat(result.fields.totalAmount.value)
      return sum + (isNaN(val) ? 0 : val)
    }, 0)

    return {
      totalFiles: entries.length,
      parsedCount: parsed.length,
      failedCount: entries.filter(e => e.status === 'failed').length,
      totalAmount,
      duplicates: 0
    }
  }
}))

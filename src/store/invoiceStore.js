import { create } from 'zustand'
import { removeFile, clearFiles } from './fileRefs.js'

const SESSION_KEY = 'tcb-session'

const BASE_INITIAL_STATE = {
  entries: [],
  results: {},
  selectedUid: null,
  selectedUids: [],
  config: {
    mergeLayout: '2x2',
    orientation: 'landscape',
    duplicateCopy: false,
    renameTemplate: '{type}-{buyerName}-{amount}'
  }
}

// Attempt to restore session from localStorage
function restoreSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (!saved || !Array.isArray(saved.entries)) return null
    // Strip any fileUid refs from restored entries
    return {
      entries: saved.entries.map(e => ({ ...e, fileUid: undefined, previewUrl: null })),
      results: saved.results || {},
      config: saved.config || BASE_INITIAL_STATE.config
    }
  } catch {
    return null
  }
}

const initialState = restoreSession() || { ...BASE_INITIAL_STATE }

// Persist session on every state change (debounced via microtask)
let _saveTimer = null
function scheduleSave(state) {
  if (_saveTimer) return
  _saveTimer = Promise.resolve().then(() => {
    _saveTimer = null
    try {
      const persistable = {
        entries: state.entries
          .filter(e => e.status === 'parsed')
          .map(e => ({
            uid: e.uid,
            fileName: e.fileName,
            fileSize: e.fileSize,
            mimeType: e.mimeType,
            previewUrl: null,
            status: 'parsed',
            error: null
          })),
        results: state.results,
        config: state.config
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(persistable))
    } catch { /* storage full or unavailable */ }
  })
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
      removeFile(uid)
      return {
        entries: state.entries.filter(e => e.uid !== uid),
        results: (() => { const r = { ...state.results }; delete r[uid]; return r })(),
        selectedUid: state.selectedUid === uid ? null : state.selectedUid
      }
    }),

  clearAll: () =>
    set(state => {
      state.entries.forEach(e => { if (e.previewUrl) URL.revokeObjectURL(e.previewUrl) })
      clearFiles()
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

  // ── Multi-select ──

  toggleSelect: (uid) =>
    set(state => ({
      selectedUids: state.selectedUids.includes(uid)
        ? state.selectedUids.filter(id => id !== uid)
        : [...state.selectedUids, uid]
    })),

  selectAll: () =>
    set(state => ({
      selectedUids: state.entries.map(e => e.uid)
    })),

  clearSelection: () =>
    set({ selectedUids: [] }),

  batchRemove: () =>
    set(state => {
      const uids = new Set(state.selectedUids)
      const remaining = state.entries.filter(e => !uids.has(e.uid))
      state.entries.forEach(e => {
        if (uids.has(e.uid) && e.previewUrl) URL.revokeObjectURL(e.previewUrl)
      })
      state.selectedUids.forEach(uid => removeFile(uid))
      const newResults = { ...state.results }
      state.selectedUids.forEach(uid => delete newResults[uid])
      return {
        entries: remaining,
        results: newResults,
        selectedUid: uids.has(state.selectedUid) ? null : state.selectedUid,
        selectedUids: []
      }
    }),

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

  /**
   * Override document type for a parsed result.
   * Used when auto-detection fails and user selects a type manually.
   */
  setDocumentType: (uid, typeId, result) =>
    set(state => ({
      results: {
        ...state.results,
        [uid]: {
          ...result,
          documentType: typeId,
          documentLabel: result.documentLabel,
          confidence: 0.5
        }
      }
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

  // ── Session ──

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY)
    set({ ...BASE_INITIAL_STATE })
  },

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

// Persist state changes to localStorage
useInvoiceStore.subscribe((state) => scheduleSave(state))

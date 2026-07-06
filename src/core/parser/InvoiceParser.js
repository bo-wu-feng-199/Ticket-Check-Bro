/**
 * InvoiceParser — Abstract base class for all document-type parsers.
 *
 * Each concrete parser implements:
 *   - `typeId`: unique identifier string
 *   - `confidence(text)`: returns 0–1 confidence score for detecting this type
 *   - `parse(text)`: returns { typeId, confidence, fields: { key: { label, value } } }
 */

import { normalizeText } from '../../utils/regexPatterns.js'

export default class InvoiceParser {
  constructor() {
    if (new.target === InvoiceParser) {
      throw new Error('InvoiceParser is abstract. Subclass it.')
    }
  }

  get typeId() {
    throw new Error('Subclass must implement typeId getter')
  }

  get label() {
    throw new Error('Subclass must implement label getter')
  }

  confidence(text) {
    throw new Error('Subclass must implement confidence(text)')
  }

  parse(text) {
    throw new Error('Subclass must implement parse(text)')
  }

  /**
   * Convenience: normalize text, run confidence + parse in one call.
   */
  analyze(text) {
    const normalized = normalizeText(text)
    const score = this.confidence(normalized)
    if (score < 0.3) return null
    return {
      documentType: this.typeId,
      documentLabel: this.label,
      confidence: score,
      fields: this.parse(normalized)
    }
  }
}

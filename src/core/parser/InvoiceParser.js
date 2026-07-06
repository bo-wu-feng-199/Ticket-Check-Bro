/**
 * InvoiceParser — Abstract base class for all document-type parsers.
 *
 * Each concrete parser implements:
 *   - `typeId`: unique identifier string
 *   - `confidence(text)`: returns 0–1 confidence score for detecting this type
 *   - `parse(text)`: returns { typeId, confidence, fields: { key: { label, value } } }
 */

export default class InvoiceParser {
  constructor() {
    if (new.target === InvoiceParser) {
      throw new Error('InvoiceParser is abstract. Subclass it.')
    }
  }

  /**
   * Unique identifier for this document type.
   * @returns {string}
   */
  get typeId() {
    throw new Error('Subclass must implement typeId getter')
  }

  /**
   * Human-readable label for this document type.
   * @returns {string}
   */
  get label() {
    throw new Error('Subclass must implement label getter')
  }

  /**
   * Detect confidence (0–1) that `text` belongs to this document type.
   * @param {string} text
   * @returns {number}
   */
  confidence(text) {
    throw new Error('Subclass must implement confidence(text)')
  }

  /**
   * Parse `text` and return structured field data.
   * @param {string} text
   * @returns {Object} fields — { key: { label, value } }
   */
  parse(text) {
    throw new Error('Subclass must implement parse(text)')
  }

  /**
   * Convenience: run confidence + parse in one call.
   */
  analyze(text) {
    const score = this.confidence(text)
    if (score < 0.3) return null
    return {
      documentType: this.typeId,
      documentLabel: this.label,
      confidence: score,
      fields: this.parse(text)
    }
  }
}

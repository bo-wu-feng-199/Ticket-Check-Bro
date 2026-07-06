/**
 * ParserFactory — detects document type and dispatches to the correct parser.
 *
 * Strategy pattern implementation:
 * - Registers all known parsers
 * - Runs confidence scoring against each
 * - Returns the best match (above threshold)
 */

import CommonInvoiceParser from './CommonInvoiceParser.js'
import TrainTicketParser from './TrainTicketParser.js'
import FlightTicketParser from './FlightTicketParser.js'
import VehicleInvoiceParser from './VehicleInvoiceParser.js'
import TaxiInvoiceParser from './TaxiInvoiceParser.js'
import FixedAmountParser from './FixedAmountParser.js'
import TollInvoiceParser from './TollInvoiceParser.js'

class ParserFactory {
  constructor() {
    this._parsers = [
      new CommonInvoiceParser(),
      new TrainTicketParser(),
      new FlightTicketParser(),
      new VehicleInvoiceParser(),
      new TaxiInvoiceParser(),
      new FixedAmountParser(),
      new TollInvoiceParser()
    ]
  }

  /**
   * Detect the best-matching document type and parse the text.
   * @param {string} rawText - Extracted text from PDF or OCR
   * @returns {Object|null} { documentType, documentLabel, confidence, fields }
   */
  analyze(rawText) {
    if (!rawText || rawText.trim().length < 10) return null

    let best = null
    let bestScore = 0

    for (const parser of this._parsers) {
      const score = parser.confidence(rawText)
      if (score > bestScore) {
        bestScore = score
        best = parser
      }
    }

    if (!best || bestScore < 0.3) return null

    const fields = best.parse(rawText)

    return {
      documentType: best.typeId,
      documentLabel: best.label,
      confidence: Math.round(bestScore * 100) / 100,
      fields
    }
  }

  /**
   * Return all registered parsers for manual type selection fallback.
   */
  get parsers() {
    return [...this._parsers]
  }

  /**
   * Parse text using a specific document type.
   * Used as fallback when auto-detection fails and user selects manually.
   * @param {string} rawText - Extracted text from PDF or OCR
   * @param {string} typeId - Document type identifier
   * @returns {Object|null} { documentType, documentLabel, confidence: 0.5, fields }
   */
  parseWithType(rawText, typeId) {
    const parser = this._parsers.find(p => p.typeId === typeId)
    if (!parser) return null

    const fields = parser.parse(rawText)

    return {
      documentType: parser.typeId,
      documentLabel: parser.label,
      confidence: 0.5,
      fields
    }
  }
}

export default new ParserFactory()
export { ParserFactory }

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
import EnglishInvoiceParser from './EnglishInvoiceParser.js'
import { normalizeText } from '../utils/regexPatterns.js'

class ParserFactory {
  constructor() {
    this._parsers = [
      new CommonInvoiceParser(),
      new TrainTicketParser(),
      new FlightTicketParser(),
      new VehicleInvoiceParser(),
      new TaxiInvoiceParser(),
      new FixedAmountParser(),
      new TollInvoiceParser(),
      new EnglishInvoiceParser()
    ]
  }

  /**
   * Register a custom parser class.
   * The class must extend InvoiceParser and implement typeId, label,
   * confidence(text), and parse(text).
   *
   * @param {new () => import('./InvoiceParser.js').default} ParserClass
   * @example
   * import { parserFactory } from '@ticket-check-bro/core'
   * import MyCustomParser from './MyCustomParser.js'
   * parserFactory.register(MyCustomParser)
   */
  register(ParserClass) {
    const instance = new ParserClass()
    // Remove existing parser with same typeId if any (allows override)
    this._parsers = this._parsers.filter(p => p.typeId !== instance.typeId)
    this._parsers.push(instance)
  }

  /**
   * Remove a parser by typeId.
   */
  unregister(typeId) {
    this._parsers = this._parsers.filter(p => p.typeId !== typeId)
  }

  /**
   * Detect the best-matching document type and parse the text.
   * Delegates to each parser's analyze() which handles text normalization.
   */
  analyze(rawText) {
    if (!rawText || rawText.trim().length < 10) return null

    let bestResult = null
    let bestScore = 0

    for (const parser of this._parsers) {
      const result = parser.analyze(rawText)
      if (result && result.confidence > bestScore) {
        bestScore = result.confidence
        bestResult = result
      }
    }

    return bestResult
  }

  get parsers() {
    return [...this._parsers]
  }

  /**
   * Parse text using a specific document type.
   */
  parseWithType(rawText, typeId) {
    const parser = this._parsers.find(p => p.typeId === typeId)
    if (!parser) return null

    const normalized = normalizeText(rawText)
    const fields = parser.parse(normalized)

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

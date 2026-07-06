import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

export default class FixedAmountParser extends InvoiceParser {
  get typeId() { return 'fixed_amount' }
  get label() { return 'Fixed-Amount Receipt' }

  confidence(text) {
    let score = 0
    if (/定额|fixed|收据|receipt/i.test(text)) score += 0.3
    if (PATTERNS.receiptCode.test(text)) score += 0.25
    if (PATTERNS.receiptNumber.test(text)) score += 0.25
    // Low length — fixed-amount receipts have very little text
    if (text && text.length < 300) score += 0.2
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      receiptCode:   { label: 'Receipt Code',   value: f(PATTERNS.receiptCode) },
      receiptNumber: { label: 'Receipt Number', value: f(PATTERNS.receiptNumber) },
      issueDate:     { label: 'Issue Date',     value: f(PATTERNS.issueDate) },
      issuerName:    { label: 'Issuer Name',    value: f(PATTERNS.issuerName) },
      amount:        { label: 'Amount',         value: f(PATTERNS.amount) }
    }
  }
}

import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

export default class TollInvoiceParser extends InvoiceParser {
  get typeId() { return 'toll_invoice' }
  get label() { return 'Toll Invoice' }

  confidence(text) {
    let score = 0
    if (/通行费|toll|收费|高速|expressway/i.test(text)) score += 0.4
    if (PATTERNS.tollStation.test(text)) score += 0.3
    if (PATTERNS.vehiclePlate.test(text)) score += 0.2
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      invoiceCode:   { label: 'Invoice Code',   value: f(PATTERNS.invoiceCode) },
      invoiceNumber: { label: 'Invoice Number', value: f(PATTERNS.invoiceNumber) },
      issueDate:     { label: 'Issue Date',     value: f(PATTERNS.issueDate) },
      tollStation:   { label: 'Toll Station',   value: f(PATTERNS.tollStation) },
      vehiclePlate:  { label: 'License Plate',  value: f(PATTERNS.vehiclePlate) },
      amount:        { label: 'Amount',         value: f(PATTERNS.amount) }
    }
  }
}

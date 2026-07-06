import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

export default class TaxiInvoiceParser extends InvoiceParser {
  get typeId() { return 'taxi_invoice' }
  get label() { return 'Taxi Receipt' }

  confidence(text) {
    let score = 0
    if (/出租车|taxi|的士|出租汽车|客运/.test(text)) score += 0.4
    if (PATTERNS.licensePlate.test(text)) score += 0.3
    if (PATTERNS.companyName.test(text)) score += 0.2
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      companyName:  { label: 'Company Name',  value: f(PATTERNS.companyName) },
      licensePlate: { label: 'License Plate', value: f(PATTERNS.licensePlate) },
      date:         { label: 'Date',          value: f(PATTERNS.departureDate) },
      time:         { label: 'Time',          value: f(PATTERNS.time) },
      amount:       { label: 'Amount',        value: f(PATTERNS.amount) }
    }
  }
}

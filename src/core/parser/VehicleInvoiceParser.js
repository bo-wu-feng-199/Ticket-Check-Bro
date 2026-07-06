import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

export default class VehicleInvoiceParser extends InvoiceParser {
  get typeId() { return 'vehicle_invoice' }
  get label() { return 'Vehicle Invoice' }

  confidence(text) {
    let score = 0
    if (/机动车|vehicle|汽车|car/i.test(text)) score += 0.3
    if (PATTERNS.vin.test(text)) score += 0.35
    if (PATTERNS.engineNumber.test(text)) score += 0.25
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      invoiceCode:   { label: 'Invoice Code',   value: f(PATTERNS.invoiceCode) },
      invoiceNumber: { label: 'Invoice Number', value: f(PATTERNS.invoiceNumber) },
      issueDate:     { label: 'Issue Date',     value: f(PATTERNS.issueDate) },
      buyerName:     { label: 'Buyer Name',     value: f(PATTERNS.buyerName) },
      vehicleModel:  { label: 'Vehicle Model',  value: f(PATTERNS.vehicleModel) },
      vin:           { label: 'VIN',            value: f(PATTERNS.vin) },
      engineNumber:  { label: 'Engine No.',     value: f(PATTERNS.engineNumber) },
      totalAmount:   { label: 'Total Amount',   value: f(PATTERNS.totalAmount) }
    }
  }
}

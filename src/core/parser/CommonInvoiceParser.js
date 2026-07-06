import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

/**
 * Parser for Chinese Value-Added Tax (VAT) Common Invoices.
 */
export default class CommonInvoiceParser extends InvoiceParser {
  get typeId() { return 'common_invoice' }
  get label() { return 'Value-Added Tax Invoice' }

  confidence(text) {
    let score = 0
    if (/发票|invoice/i.test(text)) score += 0.3
    if (PATTERNS.invoiceCode.test(text)) score += 0.25
    if (PATTERNS.invoiceNumber.test(text)) score += 0.2
    if (PATTERNS.totalAmount.test(text)) score += 0.15
    if (/购买方|买方|销售方|卖方/.test(text)) score += 0.1
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      invoiceCode:    { label: 'Invoice Code',       value: f(PATTERNS.invoiceCode) },
      invoiceNumber:  { label: 'Invoice Number',     value: f(PATTERNS.invoiceNumber) },
      issueDate:      { label: 'Issue Date',         value: f(PATTERNS.issueDate) },
      buyerName:      { label: 'Buyer Name',         value: f(PATTERNS.buyerName) },
      buyerTaxId:     { label: 'Buyer Tax ID',       value: f(PATTERNS.buyerTaxId) },
      sellerName:     { label: 'Seller Name',        value: f(PATTERNS.sellerName) },
      sellerTaxId:    { label: 'Seller Tax ID',      value: f(PATTERNS.sellerTaxId) },
      amount:         { label: 'Amount (excl. Tax)', value: f(PATTERNS.amount) },
      taxAmount:      { label: 'Tax Amount',         value: f(PATTERNS.taxAmount) },
      totalAmount:    { label: 'Total Amount',       value: f(PATTERNS.totalAmount) }
    }
  }
}

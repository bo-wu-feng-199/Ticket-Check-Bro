import InvoiceParser from './InvoiceParser.js'

export default class EnglishInvoiceParser extends InvoiceParser {
  get typeId() { return 'english_invoice' }
  get label() { return 'English Invoice' }

  confidence(text) {
    let score = 0
    if (/invoice|receipt|bill|statement/i.test(text)) score += 0.3
    if (/total|amount|date|tax/i.test(text)) score += 0.2
    if (/company|address|phone|email/i.test(text)) score += 0.15
    if (/[A-Z]{2}\d{6,10}/.test(text)) score += 0.15  // invoice number pattern
    if (/\$\s*[\d,]+\.\d{2}/.test(text)) score += 0.2   // $ amount
    return Math.min(score, 1)
  }

  parse(text) {
    const invNumMatch = text.match(/(?:invoice|receipt)\s*(?:#|number|no)[:\s]*([A-Z0-9-]+)/i)
    const dateMatch = text.match(/(?:date|issued)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i)
    const totalMatch = text.match(/total[:\s]*\$?\s*([\d,]+\.\d{2})/i)
    const companyMatch = text.match(/(?:company|from|bill to)[:\s]*([^\n]{2,40})/i)
    const taxMatch = text.match(/(?:tax|vat|gst)[:\s]*\$?\s*([\d,]+\.\d{2})/i)

    return {
      invoiceNumber: { label: 'Invoice Number', value: invNumMatch ? invNumMatch[1] : '' },
      issueDate: { label: 'Issue Date', value: dateMatch ? dateMatch[1] : '' },
      totalAmount: { label: 'Total Amount', value: totalMatch ? `$${totalMatch[1]}` : '' },
      companyName: { label: 'Company Name', value: companyMatch ? companyMatch[1].trim() : '' },
      taxAmount: { label: 'Tax Amount', value: taxMatch ? `$${taxMatch[1]}` : '' }
    }
  }
}

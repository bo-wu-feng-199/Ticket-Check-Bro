import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

/**
 * Parser for Chinese Value-Added Tax (VAT) Common Invoices.
 *
 * pdfjs-dist linearizes multi-row PDF layouts top→bottom, left→right.
 * Labels on row N and values on row N+1 end up far apart in the linear text:
 *
 *   "发票号码:开票日期:...购买方信息...开票人: 26322... 2026年01月30日 ... ¥ 2800.00"
 *
 * Strategy: split text into label-region and value-region, then extract fields
 * from the value-region using positional heuristics.
 */
export default class CommonInvoiceParser extends InvoiceParser {
  get typeId() { return 'common_invoice' }
  get label() { return 'Value-Added Tax Invoice' }

  confidence(text) {
    let score = 0
    if (/发票|invoice/i.test(text)) score += 0.3
    if (PATTERNS.invoiceNumber.test(text)) score += 0.25
    if (/购买方|买方|销售方|卖方/.test(text)) score += 0.2
    if (/价税合计|合计/.test(text)) score += 0.15
    return Math.min(score, 1)
  }

  parse(text) {
    // Split: everything before "开票人:" is labels, after is values
    const parts = text.split(/开票人\s*[:：]\s*/)
    const labelRegion = parts[0] || ''
    const valueRegion = parts.length > 1 ? parts[1] : text

    // ── Extract from value region ──

    // invoiceNumber: first 20-digit number in value region
    const invNumMatch = valueRegion.match(/(\d{16,22})/)
    const invoiceNumber = invNumMatch ? invNumMatch[1] : ''

    // issueDate: first Chinese date in value region
    const dateMatch = valueRegion.match(/(\d{4}年\d{1,2}月\d{1,2}日)/)
    let issueDate = dateMatch ? dateMatch[1] : ''
    issueDate = issueDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')

    // Company names: two long Chinese-name strings (negative lookbehind prevents digit prefix)
    const companyMatches = valueRegion.matchAll(/(?<!\d)([\u4e00-\u9fff（）()]{4,40}(?:有限公司|经营部|商行|店|厂|社|中心))/g)
    const companies = [...companyMatches].map(m => m[1])
    const buyerName = companies[0] || ''
    const sellerName = companies[1] || ''

    // Tax IDs: 15-20 char alphanumeric (skip the invoice number)
    const codeMatches = valueRegion.matchAll(/([A-Za-z0-9]{15,20})/g)
    const codes = [...codeMatches].map(m => m[1]).filter(c => c !== invoiceNumber)
    const buyerTaxId = codes[0] || ''
    const sellerTaxId = codes[1] || ''

    // Amounts: all ¥-prefixed values
    const amountMatches = valueRegion.matchAll(/[¥￥]\s*([0-9,]+\.\d{2})/g)
    const amounts = [...amountMatches].map(m => parseFloat(m[1].replace(/,/g, '')))

    // totalAmount: largest ¥ amount
    const totalAmount = amounts.length > 0 ? Math.max(...amounts).toFixed(2) : ''

    // amount (excl tax): the non-total ¥ value if there are >= 2 amounts
    const nonTaxAmounts = amounts.filter(a => a < parseFloat(totalAmount || '999999'))
    const amount = nonTaxAmounts.length > 0 ? Math.max(...nonTaxAmounts).toFixed(2) : ''

    // taxAmount: last ¥ amount or the smaller one
    const sortedDesc = [...amounts].sort((a, b) => b - a)
    const taxAmount = sortedDesc.length > 1 ? sortedDesc[sortedDesc.length - 1].toFixed(2) : ''

    // invoiceCode: try to find in label region
    const codeMatch = labelRegion.match(/发票代码[^a-zA-Z0-9]*?(\w{10,20})/)
    const invoiceCode = codeMatch ? codeMatch[1] : ''

    return {
      invoiceCode:    { label: 'Invoice Code',       value: invoiceCode },
      invoiceNumber:  { label: 'Invoice Number',     value: invoiceNumber },
      issueDate:      { label: 'Issue Date',         value: issueDate },
      buyerName:      { label: 'Buyer Name',         value: buyerName },
      buyerTaxId:     { label: 'Buyer Tax ID',       value: buyerTaxId },
      sellerName:     { label: 'Seller Name',        value: sellerName },
      sellerTaxId:    { label: 'Seller Tax ID',      value: sellerTaxId },
      amount:         { label: 'Amount (excl. Tax)', value: amount },
      taxAmount:      { label: 'Tax Amount',         value: taxAmount },
      totalAmount:    { label: 'Total Amount',       value: totalAmount }
    }
  }
}

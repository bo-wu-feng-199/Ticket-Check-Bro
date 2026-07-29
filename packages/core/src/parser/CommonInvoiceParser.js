import InvoiceParser from './InvoiceParser.js'

/**
 * Parser for Chinese Value-Added Tax (VAT) Invoices.
 *
 * Strategy: search the ENTIRE normalized text for each field independently.
 * This handles PDF layout variations where the value block may appear
 * before or after the "开票人:" marker depending on the document structure.
 */
export default class CommonInvoiceParser extends InvoiceParser {
  get typeId() { return 'common_invoice' }
  get label() { return 'Value-Added Tax Invoice' }

  confidence(text) {
    let score = 0
    if (/发票|invoice/i.test(text)) score += 0.3
    if (/开票人/.test(text)) score += 0.15
    if (/购买方|买方|销售方|卖方/.test(text)) score += 0.25
    if (/价税合计|合计/.test(text)) score += 0.2
    if (/电子发票/.test(text)) score += 0.1
    return Math.min(score, 1)
  }

  parse(text) {
    // ── Invoice Number: first 16-22 digit sequence ──
    const invNumMatch = text.match(/\b(\d{16,22})\b/)
    const invoiceNumber = invNumMatch ? invNumMatch[1] : ''

    // ── Issue Date: first Chinese date ──
    const dateMatch = text.match(/(\d{4}年\d{1,2}月\d{1,2}日)/)
    let issueDate = dateMatch ? dateMatch[1] : ''
    issueDate = issueDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')

    // ── Company names: find all company-like names, filter label fragments ──
    // Use broad suffix list but aggressively filter label-text false positives
    const companyRegex = /(?<!\d)([\u4e00-\u9fff（）()]{4,40}(?:有限公司|经营部|经销部|服饰店|服装店|器材厂|科技公司|工作室|商行|专卖店|旗舰店))/g
    const labelNoise = /信息|统一|代码|识别号|征收率|规格|型号|备注|项目名称|购买方|销售方|开票人|收款人|复核人|开户银行|银行账号|纳税人|信用|电话|地址|开户行/
    const companies = [...text.matchAll(companyRegex)]
      .map(m => m[1])
      .filter(n => !labelNoise.test(n))
      .filter((v, i, a) => a.indexOf(v) === i) // deduplicate

    const buyerName = companies[0] || ''
    const sellerName = companies.length >= 2 ? companies[1] : ''

    // ── Tax IDs: 15-20 char alphanumeric (exclude invoice number) ──
    const codeMatches = text.matchAll(/\b([A-Za-z0-9]{15,20})\b/g)
    const codes = [...codeMatches].map(m => m[1]).filter(c => c !== invoiceNumber)
    const buyerTaxId = codes[0] || ''
    const sellerTaxId = codes.length > 1 ? codes[1] : codes[0] || ''

    // ── Amounts: all ¥-prefixed values ──
    const amountMatches = text.matchAll(/[¥￥]\s*([0-9,]+\.\d{2})/g)
    const amounts = [...amountMatches].map(m => parseFloat(m[1].replace(/,/g, ''))).sort((a, b) => b - a)

    // totalAmount: largest ¥ amount (usually the total at ¥2800.00)
    const totalAmount = amounts.length > 0 ? amounts[0].toFixed(2) : ''
    // amount (excl tax): second largest
    const amount = amounts.length > 1 ? amounts[1].toFixed(2) : (amounts.length > 0 ? amounts[0].toFixed(2) : '')
    // taxAmount: smallest ¥ amount
    const taxAmount = amounts.length > 2 ? amounts[amounts.length - 1].toFixed(2) : 
                      amounts.length > 1 ? amounts[amounts.length - 1].toFixed(2) : ''

    // ── Invoice Code: may not exist on 普通发票 ──
    const codeMatch = text.match(/发票代码[^a-zA-Z0-9]*?(\w{10,20})/)
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

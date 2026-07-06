/**
 * Regular expression patterns for extracting fields from parsed document text.
 *
 * WARNING: pdfjs-dist flattens PDF text items by position (top→bottom, left→right),
 * producing linear text where labels and their values are separated by whitespace
 * and multi-character terms are split into individual characters (e.g. "发 票 号 码").
 *
 * Strategy:
 * 1. Normalize the raw text: collapse intra-label whitespace, keep structural spaces
 * 2. Use lenient patterns that allow arbitrary content between label and value
 * 3. Fall back to position-based heuristics for known layouts
 */

/**
 * Normalize extracted PDF text for regex matching.
 * - Removes spaces inserted between individual Chinese characters (position artifact)
 * - Collapses multiple spaces into single space
 * - Standardizes Chinese punctuation
 */
export function normalizeText(raw) {
  if (!raw) return ''

  let t = raw
  // Remove spaces between Chinese characters: "发 票 号 码" → "发票号码"
  t = t.replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, '$1')
  // Remove spaces between Chinese and punctuation
  t = t.replace(/([\u4e00-\u9fff])\s+(?=[：:，,。.、；;])/g, '$1')
  t = t.replace(/([：:，,。.、；;])\s+(?=[\u4e00-\u9fff])/g, '$1')
  // Collapse remaining multiple spaces
  t = t.replace(/[ \t]+/g, ' ')
  // Normalize fullwidth colon to ASCII
  t = t.replace(/：/g, ':')
  return t.trim()
}

/**
 * Extract a value that appears after a label, allowing arbitrary content between them.
 * Uses a lookahead-based approach: find the label, then scan ahead for the value pattern.
 */
export function extractValueAfter(text, labelPattern, valuePattern, maxGap = 500) {
  const labelMatch = text.match(labelPattern)
  if (!labelMatch) return null

  const labelEnd = labelMatch.index + labelMatch[0].length
  const afterText = text.substring(labelEnd, labelEnd + maxGap)
  const valueMatch = afterText.match(valuePattern)
  return valueMatch ? valueMatch[1].trim() : null
}

export const PATTERNS = {
  // ── Common VAT Invoice (China) ──

  // invoiceCode may not exist on 普通发票
  invoiceCode: /发票代码[^a-zA-Z0-9]*?(\w{10,20})/,

  // invoiceNumber: 20-digit number after "发票号码"
  invoiceNumber: /发票号码[^0-9]*?(\d{16,22})/,

  // issueDate: date after "开票日期"
  issueDate: /开票日期[^0-9]*?(\d{4}[\s年/-]*\d{1,2}[\s月/-]*\d{1,2}[\s日]?)/,

  // buyerName: company name after buyer section
  buyerName: /购买方.*?名称[^：:。]*?[:]\s*([\u4e00-\u9fff()（）\w]{2,40}?)(?=\s*统一|\s*纳税人|\s*地址|\s*电话|$)/,

  // buyerTaxId
  buyerTaxId: /购买方.*?(?:统一社会信用代码|纳税人识别号|税号)[^a-zA-Z0-9]*?([A-Za-z0-9]{15,20})/,

  // sellerName
  sellerName: /销售方.*?名称[^：:。]*?[:]\s*([\u4e00-\u9fff()（）\w]{2,40}?)(?=\s*统一|\s*纳税人|\s*地址|\s*电话|$)/,

  // sellerTaxId
  sellerTaxId: /销售方.*?(?:统一社会信用代码|纳税人识别号|税号)[^a-zA-Z0-9]*?([A-Za-z0-9]{15,20})/,

  // amount (excl. tax) — find the smaller ¥ amount that appears before tax-amount
  amount: /(?:金[\s]*额|金额)[^0-9]*?([0-9,]+\.\d{2})/,

  // taxAmount
  taxAmount: /(?:税[\s]*额|税额)[^0-9]*?([0-9,]+\.\d{2})/,

  // totalAmount — the largest ¥ value or the one after 价税合计/小写
  totalAmount: /(?:价税合计|小写\))[^0-9]*?(?:[¥￥])?\s*([0-9,]+\.\d{2})/,

  // ── Train ticket ──
  trainNumber: /(?:车次)[^a-zA-Z0-9]*?([A-Z0-9]+)/,
  origin: /(?:出发|始发)[^:：\u4e00-\u9fff]*?([\u4e00-\u9fff]{1,8})/,
  destination: /(?:到达|终点)[^:：\u4e00-\u9fff]*?([\u4e00-\u9fff]{1,8})/,
  departureDate: /(?:日期|出发日期)[^0-9]*?(\d{4}[\s年/-]*\d{1,2}[\s月/-]*\d{1,2}[\s日]?)/,
  departureTime: /(?:时间|出发时间|开车时间)[^0-9]*?(\d{2}:\d{2})/,
  seatType: /(?:座|座位|席别)[^:：]*?([\u4e00-\u9fff]{1,6}(?:座|卧|铺|票))/,
  passengerName: /(?:姓名|旅客|乘客)[^:：]*?([\u4e00-\u9fff]{2,8})/,

  // ── Flight ticket ──
  flightNumber: /(?:航班)[^a-zA-Z0-9]*?([A-Z]{2}\d{1,4})/,
  airlineName: /(?:航空公司|航司)[^:：]*?([\u4e00-\u9fff]{2,16})/,
  ticketNumber: /(?:票号|客票号码)[^a-zA-Z0-9]*?([A-Z0-9]{10,14})/,

  // ── Vehicle invoice ──
  vehicleModel: /(?:车辆型号|品牌型号)[^:：]*?([^\s]{2,30})/,
  vin: /(?:车架号|VIN)[^a-zA-Z0-9]*?([A-HJ-NPR-Z0-9]{17})/,
  engineNumber: /(?:发动机号|发动机)[^a-zA-Z0-9]*?([A-Za-z0-9]{6,12})/,

  // ── Taxi receipt ──
  companyName: /(?:公司|单位|出租公司)[^:：]*?([\u4e00-\u9fff]{2,20})/,
  licensePlate: /(?:车牌|车牌号)[^:：]*?([\u4e00-\u9fff][A-Z0-9]{5,6})/,
  time: /(?:时间|上车时间)[^0-9]*?(\d{2}:\d{2})/,

  // ── Fixed-amount receipt ──
  receiptCode: /(?:票据代码|收据代码)[^a-zA-Z0-9]*?([A-Z0-9]+)/,
  receiptNumber: /(?:票据号码|收据号码)[^a-zA-Z0-9]*?([A-Z0-9]+)/,
  issuerName: /(?:开票单位|开具单位)[^:：]*?([\u4e00-\u9fff]{2,24})/,

  // ── Toll invoice ──
  tollStation: /(?:收费站|入口)[^:：]*?([\u4e00-\u9fff]{2,12})/,
  vehiclePlate: /(?:车牌|车牌号)[^:：]*?([\u4e00-\u9fff][A-Z0-9]{5,6})/
}

/**
 * Try to extract a field using multiple patterns (fallback order).
 */
export function extractField(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      let val = match[1].trim()
      // Clean up year/month/date separators
      val = val.replace(/[\s年]/g, '-').replace(/[\s月]/g, '-').replace(/[\s日]/g, '')
      return val
    }
  }
  return null
}

/**
 * Generic numeric amount extractor — finds significant ¥ amounts.
 */
export function extractAmount(text) {
  const matches = text.match(/[¥￥]?\s*([0-9,]+\.\d{2})/g)
  if (!matches) return null
  const amounts = matches.map(m => parseFloat(m.replace(/[¥￥,\s]/g, '')))
  const max = Math.max(...amounts)
  return max > 0 ? max.toFixed(2) : null
}

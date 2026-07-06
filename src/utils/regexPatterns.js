/**
 * Regular expression patterns for extracting fields from parsed document text.
 * These patterns are heuristic — they attempt to locate common invoice fields
 * in Chinese financial documents based on known layout conventions.
 */

export const PATTERNS = {
  // Common VAT Invoice (China)
  invoiceCode: /发票代码[：:\s]*([A-Z0-9]+)/i,
  invoiceNumber: /发票号码[：:\s]*([A-Z0-9]+)/i,
  issueDate: /开票日期[：:\s]*(\d{4}[年/-]\d{1,2}[月/-]\d{1,2}[日]?)/,
  buyerName: /(?:购买方|买方)[\s\S]{0,20}?(?:名称|名)[：:\s]*([^\n]{2,40})/,
  buyerTaxId: /(?:购买方|买方)[\s\S]{0,20}?(?:纳税人识别号|税号)[：:\s]*([A-Za-z0-9]+)/,
  sellerName: /(?:销售方|卖方)[\s\S]{0,20}?(?:名称|名)[：:\s]*([^\n]{2,40})/,
  sellerTaxId: /(?:销售方|卖方)[\s\S]{0,20}?(?:纳税人识别号|税号)[：:\s]*([A-Za-z0-9]+)/,
  amount: /(?:金额|价税合计[^0-9]*)(?:[：:\s]*[¥￥]?)\s*([0-9,]+\.\d{2})/,
  taxAmount: /税额[：:\s]*[¥￥]?\s*([0-9,]+\.\d{2})/,
  totalAmount: /(?:价税合计|总计)[^0-9]*[¥￥]?\s*([0-9,]+\.\d{2})/,

  // Train ticket
  trainNumber: /(?:车次|train)[：:\s]*([A-Z0-9]+)/i,
  origin: /(?:出发|始发)[站站]?[：:\s]*([\u4e00-\u9fff]{1,8})/,
  destination: /(?:到达|终点)[站站]?[：:\s]*([\u4e00-\u9fff]{1,8})/,
  departureDate: /(?:日期|出发日期)[：:\s]*(\d{4}[年/-]\d{1,2}[月/-]\d{1,2}[日]?)/,
  departureTime: /(?:时间|出发时间|开车时间)[：:\s]*(\d{2}:\d{2})/,
  seatType: /(?:座|座位|席别)[：:\s]*([\u4e00-\u9fff]{1,6}(?:座|卧|铺|票))/,
  passengerName: /(?:姓名|旅客|乘客)[：:\s]*([\u4e00-\u9fff]{2,8})/,

  // Flight ticket
  flightNumber: /(?:航班|flight)[：:\s]*([A-Z0-9]{2}\d{1,4})/i,
  airlineName: /(?:航空公司|航司)[：:\s]*([\u4e00-\u9fff]{2,16})/,
  ticketNumber: /(?:票号|客票号码)[：:\s]*([A-Z0-9]{10,14})/,

  // Vehicle invoice
  vehicleModel: /(?:车辆型号|品牌型号)[：:\s]*([^\n]{2,30})/,
  vin: /(?:车架号|VIN|vin)[：:\s]*([A-HJ-NPR-Z0-9]{17})/i,
  engineNumber: /(?:发动机号|发动机)[：:\s]*([A-Za-z0-9]{6,12})/,

  // Taxi receipt
  companyName: /(?:公司|单位|出租公司)[：:\s]*([^\n]{2,20})/,
  licensePlate: /(?:车牌|车牌号)[：:\s]*([\u4e00-\u9fff][A-Z0-9]{5,6})/,
  time: /(?:时间|上车时间)[：:\s]*(\d{2}:\d{2})/,

  // Fixed-amount receipt
  receiptCode: /(?:票据代码|收据代码)[：:\s]*([A-Z0-9]+)/,
  receiptNumber: /(?:票据号码|收据号码)[：:\s]*([A-Z0-9]+)/,
  issuerName: /(?:开票单位|开具单位)[：:\s]*([^\n]{2,24})/,

  // Toll invoice
  tollStation: /(?:收费站|入口[：:\s]*)([\u4e00-\u9fff]{2,12})/,
  vehiclePlate: /(?:车牌|车牌号)[：:\s]*([\u4e00-\u9fff][A-Z0-9]{5,6})/
}

/**
 * Try to extract a field using multiple patterns (fallback order).
 */
export function extractField(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  return null
}

/**
 * Generic numeric amount extractor — finds the first significant ¥ amount in text.
 */
export function extractAmount(text) {
  const matches = text.match(/[¥￥]?\s*([0-9,]+\.\d{2})/g)
  if (!matches) return null
  // Return the largest amount (usually the total)
  const amounts = matches.map(m => parseFloat(m.replace(/[¥￥,\s]/g, '')))
  const max = Math.max(...amounts)
  return max > 0 ? max.toFixed(2) : null
}

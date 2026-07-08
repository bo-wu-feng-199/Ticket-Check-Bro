export const DEMO_ENTRIES = [
  { uid: 'demo-1', fileName: 'invoice-sample-1.pdf', fileSize: 45678, mimeType: 'application/pdf', status: 'parsed', error: null },
  { uid: 'demo-2', fileName: 'receipt-sample-2.jpg', fileSize: 23100, mimeType: 'image/jpeg', status: 'parsed', error: null },
]
export const DEMO_RESULTS = {
  'demo-1': {
    documentType: 'common_invoice',
    documentLabel: 'Value-Added Tax Invoice',
    confidence: 0.92,
    fields: {
      invoiceCode: { label: 'Invoice Code', value: '3100223344' },
      invoiceNumber: { label: 'Invoice Number', value: '20250315000000123456' },
      issueDate: { label: 'Issue Date', value: '2025-03-15' },
      buyerName: { label: 'Buyer Name', value: '深圳科技有限公司' },
      sellerName: { label: 'Seller Name', value: '上海贸易有限公司' },
      totalAmount: { label: 'Total Amount', value: '28000.00' },
      amount: { label: 'Amount (excl. Tax)', value: '25225.23' },
      taxAmount: { label: 'Tax Amount', value: '2774.77' }
    }
  },
  'demo-2': {
    documentType: 'taxi_invoice',
    documentLabel: 'Taxi Receipt',
    confidence: 0.85,
    fields: {
      companyName: { label: 'Company Name', value: '广州市白云出租车公司' },
      licensePlate: { label: 'License Plate', value: '粤A·88888' },
      date: { label: 'Date', value: '2025-03-20' },
      time: { label: 'Time', value: '14:30' },
      amount: { label: 'Amount', value: '45.00' }
    }
  }
}

/**
 * Excel export templates.
 *
 * Each template defines which columns to include and their display labels.
 * Columns are matched against parsed fields by field key; missing fields
 * render as empty cells. 'fileName' / 'documentType' / 'confidence' are
 * pseudo-columns from the entry metadata.
 */

const FILE_NAME = { key: 'fileName', label: 'File Name' }
const DOC_TYPE = { key: 'documentType', label: 'Document Type' }

/**
 * Full export — every schema field per document type.
 * Used as default when no template is selected.
 */
export const TEMPLATE_FULL = {
  id: 'full',
  label: 'All Fields',
  columns: null // null = include all schema fields
}

/**
 * Finance / accounting reconciliation template.
 * Focus: invoice identity + money flows for bookkeeping.
 */
export const TEMPLATE_RECONCILIATION = {
  id: 'reconciliation',
  label: 'Reconciliation',
  columns: [
    FILE_NAME,
    DOC_TYPE,
    { key: 'invoiceCode', label: 'Invoice Code' },
    { key: 'invoiceNumber', label: 'Invoice Number' },
    { key: 'issueDate', label: 'Issue Date' },
    { key: 'buyerName', label: 'Buyer Name' },
    { key: 'sellerName', label: 'Seller Name' },
    { key: 'amount', label: 'Amount (excl. Tax)' },
    { key: 'taxAmount', label: 'Tax Amount' },
    { key: 'totalAmount', label: 'Total Amount' }
  ]
}

/**
 * Travel / expense reimbursement template.
 * Focus: date, route, passenger, ticket amount.
 */
export const TEMPLATE_TRAVEL = {
  id: 'travel',
  label: 'Travel Reimbursement',
  columns: [
    FILE_NAME,
    DOC_TYPE,
    { key: 'departureDate', label: 'Departure Date' },
    { key: 'issueDate', label: 'Issue Date' },
    { key: 'date', label: 'Date' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'departureTime', label: 'Departure Time' },
    { key: 'trainNumber', label: 'Train / Flight' },
    { key: 'flightNumber', label: 'Flight Number' },
    { key: 'passengerName', label: 'Passenger' },
    { key: 'amount', label: 'Amount' },
    { key: 'totalAmount', label: 'Total Amount' }
  ]
}

export const EXCEL_TEMPLATES = [TEMPLATE_FULL, TEMPLATE_RECONCILIATION, TEMPLATE_TRAVEL]

export function getTemplateById(id) {
  return EXCEL_TEMPLATES.find(t => t.id === id) || TEMPLATE_FULL
}

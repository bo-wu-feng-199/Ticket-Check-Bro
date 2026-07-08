/**
 * Document field schemas for each supported document type.
 * Each schema defines the fields the parser extracts and their display metadata.
 */

export const DOCUMENT_TYPES = {
  common_invoice: {
    id: 'common_invoice',
    label: 'Value-Added Tax Invoice',
    icon: 'FileText'
  },
  train_ticket: {
    id: 'train_ticket',
    label: 'Train Ticket',
    icon: 'Train'
  },
  flight_ticket: {
    id: 'flight_ticket',
    label: 'Flight Itinerary',
    icon: 'Plane'
  },
  vehicle_invoice: {
    id: 'vehicle_invoice',
    label: 'Vehicle Invoice',
    icon: 'Car'
  },
  taxi_invoice: {
    id: 'taxi_invoice',
    label: 'Taxi Receipt',
    icon: 'Taxi'
  },
  fixed_amount: {
    id: 'fixed_amount',
    label: 'Fixed-Amount Receipt',
    icon: 'Receipt'
  },
  toll_invoice: {
    id: 'toll_invoice',
    label: 'Toll Invoice',
    icon: 'Road'
  },
  english_invoice: {
    id: 'english_invoice',
    label: 'English Invoice',
    icon: 'FileText'
  }
}

/**
 * Get the field schema for a given document type.
 * Each field: { key, label, type ('text'|'currency'|'date'|'number'), width (Excel column width) }
 */
export function getFieldSchema(typeId) {
  const common = [
    { key: 'invoiceCode',    label: 'Invoice Code',       type: 'text',     width: 18 },
    { key: 'invoiceNumber',  label: 'Invoice Number',     type: 'text',     width: 16 },
    { key: 'issueDate',      label: 'Issue Date',         type: 'date',     width: 14 },
    { key: 'buyerName',      label: 'Buyer Name',         type: 'text',     width: 30 },
    { key: 'buyerTaxId',     label: 'Buyer Tax ID',       type: 'text',     width: 22 },
    { key: 'sellerName',     label: 'Seller Name',        type: 'text',     width: 30 },
    { key: 'sellerTaxId',    label: 'Seller Tax ID',      type: 'text',     width: 22 },
    { key: 'amount',         label: 'Amount (excl. Tax)', type: 'currency', width: 18 },
    { key: 'taxAmount',      label: 'Tax Amount',         type: 'currency', width: 16 },
    { key: 'totalAmount',    label: 'Total Amount',       type: 'currency', width: 18 }
  ]

  const schemas = {
    common_invoice: common,

    train_ticket: [
      { key: 'trainNumber',   label: 'Train Number',  type: 'text',     width: 14 },
      { key: 'origin',        label: 'Origin Station', type: 'text',    width: 20 },
      { key: 'destination',   label: 'Destination',    type: 'text',    width: 20 },
      { key: 'departureDate', label: 'Departure Date', type: 'date',    width: 16 },
      { key: 'departureTime', label: 'Departure Time', type: 'text',    width: 14 },
      { key: 'seatType',      label: 'Seat Type',      type: 'text',   width: 16 },
      { key: 'passengerName', label: 'Passenger Name',  type: 'text',  width: 20 },
      { key: 'amount',        label: 'Amount',         type: 'currency', width: 14 }
    ],

    flight_ticket: [
      { key: 'flightNumber',   label: 'Flight Number',  type: 'text',    width: 14 },
      { key: 'airlineName',    label: 'Airline',        type: 'text',    width: 24 },
      { key: 'origin',         label: 'Departure',      type: 'text',    width: 20 },
      { key: 'destination',    label: 'Arrival',        type: 'text',    width: 20 },
      { key: 'departureDate',  label: 'Departure Date', type: 'date',    width: 16 },
      { key: 'passengerName',  label: 'Passenger',      type: 'text',    width: 20 },
      { key: 'ticketNumber',   label: 'Ticket No.',     type: 'text',    width: 18 },
      { key: 'amount',         label: 'Amount',         type: 'currency', width: 14 }
    ],

    vehicle_invoice: [
      { key: 'invoiceCode',    label: 'Invoice Code',       type: 'text',     width: 18 },
      { key: 'invoiceNumber',  label: 'Invoice Number',     type: 'text',     width: 16 },
      { key: 'issueDate',      label: 'Issue Date',         type: 'date',     width: 14 },
      { key: 'buyerName',      label: 'Buyer Name',         type: 'text',     width: 30 },
      { key: 'vehicleModel',   label: 'Vehicle Model',      type: 'text',     width: 28 },
      { key: 'vin',            label: 'VIN',                type: 'text',     width: 22 },
      { key: 'engineNumber',   label: 'Engine No.',         type: 'text',     width: 20 },
      { key: 'totalAmount',    label: 'Total Amount',       type: 'currency', width: 18 }
    ],

    taxi_invoice: [
      { key: 'companyName',    label: 'Company Name',    type: 'text',     width: 24 },
      { key: 'licensePlate',   label: 'License Plate',   type: 'text',     width: 14 },
      { key: 'date',           label: 'Date',            type: 'date',     width: 14 },
      { key: 'time',           label: 'Time',            type: 'text',     width: 12 },
      { key: 'amount',         label: 'Amount',          type: 'currency', width: 14 }
    ],

    fixed_amount: [
      { key: 'receiptCode',    label: 'Receipt Code',    type: 'text',     width: 18 },
      { key: 'receiptNumber',  label: 'Receipt Number',  type: 'text',     width: 16 },
      { key: 'issueDate',      label: 'Issue Date',      type: 'date',     width: 14 },
      { key: 'issuerName',     label: 'Issuer Name',     type: 'text',     width: 24 },
      { key: 'amount',         label: 'Amount',          type: 'currency', width: 14 }
    ],

    toll_invoice: [
      { key: 'invoiceCode',    label: 'Invoice Code',    type: 'text',     width: 18 },
      { key: 'invoiceNumber',  label: 'Invoice Number',  type: 'text',     width: 16 },
      { key: 'issueDate',      label: 'Issue Date',      type: 'date',     width: 14 },
      { key: 'tollStation',    label: 'Toll Station',    type: 'text',     width: 24 },
      { key: 'vehiclePlate',   label: 'License Plate',   type: 'text',     width: 14 },
      { key: 'amount',         label: 'Amount',          type: 'currency', width: 14 }
    ],

    english_invoice: [
      { key: 'invoiceNumber',  label: 'Invoice Number',  type: 'text',     width: 18 },
      { key: 'issueDate',      label: 'Issue Date',      type: 'date',     width: 14 },
      { key: 'totalAmount',    label: 'Total Amount',    type: 'currency', width: 18 },
      { key: 'companyName',    label: 'Company Name',    type: 'text',     width: 30 },
      { key: 'taxAmount',      label: 'Tax Amount',      type: 'currency', width: 16 }
    ]
  }

  return schemas[typeId] || schemas.common_invoice
}

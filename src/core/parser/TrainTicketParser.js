import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

export default class TrainTicketParser extends InvoiceParser {
  get typeId() { return 'train_ticket' }
  get label() { return 'Train Ticket' }

  confidence(text) {
    let score = 0
    if (/火车|train|高铁|动车/.test(text)) score += 0.3
    if (PATTERNS.trainNumber.test(text)) score += 0.3
    if (PATTERNS.passengerName.test(text) && PATTERNS.origin.test(text)) score += 0.3
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      trainNumber:   { label: 'Train Number',   value: f(PATTERNS.trainNumber) },
      origin:        { label: 'Origin',          value: f(PATTERNS.origin) },
      destination:   { label: 'Destination',     value: f(PATTERNS.destination) },
      departureDate: { label: 'Departure Date',  value: f(PATTERNS.departureDate) },
      departureTime: { label: 'Departure Time',  value: f(PATTERNS.departureTime) },
      seatType:      { label: 'Seat Type',       value: f(PATTERNS.seatType) },
      passengerName: { label: 'Passenger Name',  value: f(PATTERNS.passengerName) },
      amount:        { label: 'Amount',          value: f(PATTERNS.amount) }
    }
  }
}

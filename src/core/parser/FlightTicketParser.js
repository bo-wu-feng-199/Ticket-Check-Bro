import InvoiceParser from './InvoiceParser.js'
import { PATTERNS, extractField } from '../../utils/regexPatterns.js'

export default class FlightTicketParser extends InvoiceParser {
  get typeId() { return 'flight_ticket' }
  get label() { return 'Flight Itinerary' }

  confidence(text) {
    let score = 0
    if (/飞机|flight|航空|airline/i.test(text)) score += 0.3
    if (PATTERNS.flightNumber.test(text)) score += 0.35
    if (PATTERNS.ticketNumber.test(text)) score += 0.25
    if (/行程单|客票|itinerary/i.test(text)) score += 0.1
    return Math.min(score, 1)
  }

  parse(text) {
    const f = (pattern) => extractField(text, [pattern]) || ''

    return {
      flightNumber:  { label: 'Flight Number',  value: f(PATTERNS.flightNumber) },
      airlineName:   { label: 'Airline',        value: f(PATTERNS.airlineName) },
      origin:        { label: 'Departure',      value: f(PATTERNS.origin) },
      destination:   { label: 'Arrival',        value: f(PATTERNS.destination) },
      departureDate: { label: 'Departure Date', value: f(PATTERNS.departureDate) },
      passengerName: { label: 'Passenger',      value: f(PATTERNS.passengerName) },
      ticketNumber:  { label: 'Ticket No.',     value: f(PATTERNS.ticketNumber) },
      amount:        { label: 'Amount',         value: f(PATTERNS.amount) }
    }
  }
}

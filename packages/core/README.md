# @ticket-check-bro/core

Standalone parser engine — extract structured data from invoices, receipts, and travel documents. Zero dependencies, works in browser and Node.js.

## Installation

```bash
npm install @ticket-check-bro/core
```

## Quick Start

```js
import parserFactory from '@ticket-check-bro/core'

const text = `
发票号码: 20250315000000123456
开票日期: 2025年03月15日
购买方: 深圳科技有限公司
销售方: 上海贸易有限公司
价税合计: ¥28,000.00
`

const result = parserFactory.analyze(text)

console.log(result.documentType)  // 'common_invoice'
console.log(result.fields.totalAmount.value)  // '28000.00'
console.log(Math.round(result.confidence * 100))  // > 90
```

## API

### `parserFactory.analyze(text)`

Auto-detect document type and extract fields.

**Parameters**
- `text` (string) — Raw extracted text from PDF or OCR

**Returns** — Object or `null` (if text is too short)
```ts
{
  documentType: string       // e.g. 'common_invoice'
  documentLabel: string      // e.g. 'Value-Added Tax Invoice'
  confidence: number         // 0.0 – 1.0
  fields: Record<string, {
    label: string
    value: string
    numeric?: number         // only for currency fields
    currency?: string        // only for currency fields
    confidence?: number      // per-field confidence (0.0–1.0)
  }>
}
```

### `parserFactory.parseWithType(text, typeId)`

Parse using a specific document type (skip auto-detection).

```js
const result = parserFactory.parseWithType(text, 'english_invoice')
```

### `parserFactory.register(ParserClass)`

Register a custom parser at runtime.

```js
import { parserFactory, InvoiceParser } from '@ticket-check-bro/core'

class MyParser extends InvoiceParser {
  get typeId() { return 'my_format' }
  get label() { return 'My Custom Format' }

  confidence(text) { /* return 0.0–1.0 */ }
  parse(text) { /* return { fieldKey: { label, value } } */ }
}

parserFactory.register(MyParser)
```

### `parserFactory.unregister(typeId)`

Remove a parser by type ID.

### `parserFactory.parsers`

Get a copy of all registered parser instances.

```js
parserFactory.parsers.forEach(p => console.log(p.label))
```

## Supported Document Types

| typeId | Label | Origin |
|--------|-------|--------|
| `common_invoice` | Value-Added Tax Invoice | China |
| `train_ticket` | Train Ticket | China |
| `flight_ticket` | Flight Itinerary | China |
| `vehicle_invoice` | Vehicle Invoice | China |
| `taxi_invoice` | Taxi Receipt | China |
| `fixed_amount` | Fixed-Amount Receipt | China |
| `toll_invoice` | Toll Invoice | China |
| `english_invoice` | English Invoice | Global |

## Writing a Custom Parser

Extend `InvoiceParser` and implement 3 methods:

```js
import { InvoiceParser } from '@ticket-check-bro/core'

export default class ReceiptParser extends InvoiceParser {
  get typeId() { return 'receipt' }
  get label() { return 'Generic Receipt' }

  confidence(text) {
    if (/receipt|total/i.test(text)) return 0.7
    return 0.1
  }

  parse(text) {
    return {
      storeName: { label: 'Store Name', value: extractStoreName(text) },
      total: { label: 'Total', value: extractTotal(text) },
    }
  }
}
```

Then register:

```js
parserFactory.register(ReceiptParser)
```

## Utilities

### `getFieldSchema(typeId)`

Get the field schema for a document type (column labels, types, widths).

### `DOCUMENT_TYPES`

Map of all supported document type metadata.

### `formatFieldValue(value, type)`

Format a value for display by type (`text`, `currency`, `date`, `number`).

### `formatCurrency(value)`

Format a number as `¥XX,XXX.XX`.

### `sanitizeFilename(name)`

Remove illegal filesystem characters from a string.

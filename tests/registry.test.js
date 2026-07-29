import { describe, test, expect } from 'vitest'
import parserFactory, { InvoiceParser } from '@ticket-check-bro/core'

describe('Parser Registry', () => {
  class TestParser extends InvoiceParser {
    get typeId() { return 'test_format' }
    get label() { return 'Test Format' }
    confidence(text) { return text.includes('TEST') ? 0.9 : 0 }
    parse(text) { return { testField: { label: 'Test', value: 'ok' } } }
  }

  test('register adds a new parser', () => {
    const before = parserFactory.parsers.length
    parserFactory.register(TestParser)
    expect(parserFactory.parsers.length).toBe(before + 1)
  })

  test('registered parser is used for matching text', () => {
    const result = parserFactory.analyze('THIS IS A TEST DOCUMENT')
    expect(result.documentType).toBe('test_format')
  })

  test('unregister removes a parser', () => {
    parserFactory.unregister('test_format')
    expect(parserFactory.parsers.find(p => p.typeId === 'test_format')).toBeUndefined()
  })

  test('register replaces existing parser with same typeId', () => {
    parserFactory.register(TestParser)
    const before = parserFactory.parsers.length
    parserFactory.register(TestParser) // register again
    expect(parserFactory.parsers.length).toBe(before) // length unchanged (replaced)
    parserFactory.unregister('test_format')
  })
})

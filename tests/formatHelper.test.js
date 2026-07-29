import { describe, test, expect } from 'vitest'
import { formatFieldValue, normalizeFieldValue, formatCurrency, sanitizeFilename } from '../src/utils/formatHelper.js'

describe('formatCurrency', () => {
  test('formats number with ¥ and commas', () => {
    expect(formatCurrency(28000)).toBe('¥28,000.00')
  })

  test('handles decimals', () => {
    expect(formatCurrency(249.5)).toBe('¥249.50')
  })

  test('handles zero', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })

  test('returns dash for null/NaN', () => {
    expect(formatCurrency(null)).toBe('—')
    expect(formatCurrency(undefined)).toBe('—')
    expect(formatCurrency(NaN)).toBe('—')
  })
})

describe('formatFieldValue', () => {
  test('text type returns string', () => {
    expect(formatFieldValue('hello', 'text')).toBe('hello')
  })

  test('currency type formats number', () => {
    expect(formatFieldValue(5000, 'currency')).toBe('¥5,000.00')
  })

  test('currency type parses string', () => {
    expect(formatFieldValue('5000', 'currency')).toBe('¥5,000.00')
  })
})

describe('normalizeFieldValue', () => {
  test('adds numeric for currency fields', () => {
    const result = normalizeFieldValue({ value: '28000.00', label: 'Total' }, { type: 'currency' })
    expect(result.numeric).toBe(28000)
    expect(result.currency).toBe('CNY')
  })

  test('passes through non-currency fields', () => {
    const field = { value: 'ABC-123', label: 'Invoice Code' }
    const result = normalizeFieldValue(field, { type: 'text' })
    expect(result).toBe(field)
  })
})

describe('sanitizeFilename', () => {
  test('removes illegal characters', () => {
    const result = sanitizeFilename('test: file/name*.pdf')
    expect(result).not.toContain(':')
    expect(result).not.toContain('/')
    expect(result).not.toContain('*')
  })
})

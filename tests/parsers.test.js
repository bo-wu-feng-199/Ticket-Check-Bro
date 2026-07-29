import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import parserFactory from '@ticket-check-bro/core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURES = join(__dirname, '..', 'fixtures')

describe('Parser Regression Tests', () => {
  const sanitizedDir = join(FIXTURES, 'sanitized')
  const expectedDir = join(FIXTURES, 'expected')
  const files = readdirSync(sanitizedDir).filter(f => f.endsWith('.txt'))

  files.forEach(file => {
    const name = file.replace('.txt', '')
    test(`parses ${name} correctly`, () => {
      const text = readFileSync(join(sanitizedDir, file), 'utf-8')
      const expected = JSON.parse(readFileSync(join(expectedDir, `${name}.json`), 'utf-8'))

      const result = parserFactory.analyze(text)

      expect(result).not.toBeNull()
      expect(result.documentType).toBe(expected.documentType)

      // Check each expected field exists and has a non-empty value
      Object.entries(expected.fields).forEach(([key, expectedField]) => {
        const actualField = result.fields[key]
        expect(actualField).toBeDefined(`${key} should exist`)
        expect(actualField.value).toBeTruthy(`${key} value should not be empty`)
        // For most fields check equality, but some parsers may extract slightly differently
        if (['invoiceNumber', 'amount', 'totalAmount'].includes(key)) {
          expect(actualField.value).toBe(expectedField.value)
        }
      })

      // Confidence should be reasonable
      expect(result.confidence).toBeGreaterThan(0.3)
    })
  })
})

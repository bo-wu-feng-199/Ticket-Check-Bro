import { describe, test, expect } from 'vitest'
import { EXCEL_TEMPLATES, getTemplateById, TEMPLATE_FULL } from '../src/core/exporter/excelTemplates.js'

describe('Excel Templates', () => {
  test('has 3 templates: full, reconciliation, travel', () => {
    const ids = EXCEL_TEMPLATES.map(t => t.id)
    expect(ids).toContain('full')
    expect(ids).toContain('reconciliation')
    expect(ids).toContain('travel')
  })

  test('every template has id, label, and columns (full may be null)', () => {
    EXCEL_TEMPLATES.forEach(t => {
      expect(typeof t.id).toBe('string')
      expect(typeof t.label).toBe('string')
      if (t.id !== 'full') {
        expect(Array.isArray(t.columns)).toBe(true)
      }
    })
  })

  test('template columns have key and label', () => {
    EXCEL_TEMPLATES.filter(t => t.id !== 'full').forEach(t => {
      t.columns.forEach(c => {
        expect(typeof c.key).toBe('string')
        expect(typeof c.label).toBe('string')
      })
    })
  })

  test('getTemplateById returns full for unknown id', () => {
    expect(getTemplateById('nonexistent')).toBe(TEMPLATE_FULL)
  })

  test('getTemplateById finds existing template', () => {
    expect(getTemplateById('travel').id).toBe('travel')
  })
})

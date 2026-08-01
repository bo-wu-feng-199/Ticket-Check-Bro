import { describe, test, expect } from 'vitest'
import { LAYOUT_PRESETS } from '../src/core/exporter/LayoutMerger.js'

describe('Layout Presets', () => {
  test('presets have valid grid dimensions', () => {
    LAYOUT_PRESETS.forEach(p => {
      expect(p.cols).toBeGreaterThan(0)
      expect(p.rows).toBeGreaterThan(0)
      expect(p.id).toMatch(/^\d+x\d+$/)
    })
  })

  test('has 7 layout options from 1x1 to 4x4', () => {
    expect(LAYOUT_PRESETS.length).toBe(7)
  })
})

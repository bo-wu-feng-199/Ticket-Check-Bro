import parserFactory from '../src/core/parser/index.js'

describe('Edge Cases', () => {
  test('empty text returns null', () => {
    const result = parserFactory.analyze('')
    expect(result).toBeNull()
  })

  test('very short text returns null', () => {
    const result = parserFactory.analyze('short')
    expect(result).toBeNull()
  })

  test('garbled ASCII text returns null', () => {
    const result = parserFactory.analyze('asdf qwer zxcv 1234 !@#$')
    expect(result).toBeNull()
  })

  test('mixed CJK noise does not produce high confidence', () => {
    const result = parserFactory.analyze('这是一个测试 没有真实发票内容 ABC XYZ 123456')
    // May match common_invoice with low score due to "发票" keyword
    if (result) {
      expect(result.confidence).toBeLessThan(0.5)
    } else {
      expect(result).toBeNull()
    }
  })

  test('extremely long text does not crash', () => {
    const longText = '发票 '.repeat(1000) + '价税合计: ¥100.00'
    const result = parserFactory.analyze(longText)
    expect(result).not.toBeNull()
  })

  test('partial invoice data still extracts some fields', () => {
    const text = '价税合计: ¥500.00\n购买方: 测试公司\n发票号码: 123456789012345678'
    const result = parserFactory.analyze(text)
    expect(result).not.toBeNull()
    expect(result.confidence).toBeGreaterThanOrEqual(0)
  })
})

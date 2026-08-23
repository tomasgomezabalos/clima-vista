import { describe, expect, it } from 'vitest'
import { formatMeasurement } from '../../../src/pages/Home/utils'

describe('Home measurement formatting', () => {
  it('formats available values with Spanish decimal notation and their unit', () => {
    expect(formatMeasurement(24.3, '°C', 'No disponible', 'es')).toBe('24,3 °C')
  })

  it('formats available values with English decimal notation and their unit', () => {
    expect(formatMeasurement(24.3, '°C', 'Unavailable', 'en')).toBe('24.3 °C')
  })

  it('returns the explicit unavailable label for missing values', () => {
    expect(formatMeasurement(null, '%', 'No disponible', 'es')).toBe(
      'No disponible',
    )
  })
})

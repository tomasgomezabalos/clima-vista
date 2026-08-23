import { describe, expect, it } from 'vitest'
import {
  forecastInvalidFixture,
  forecastPartialFixture,
  forecastSuccessFixture,
  geocodingEmptyFixture,
  geocodingSuccessFixture,
} from '../../../mocks/fixtures/openMeteo'
import {
  InvalidOpenMeteoResponseError,
  formatForecastDate,
  getWeatherCondition,
  parseForecastResponse,
  parseGeocodingResponse,
} from '../../../src/services/openMeteo/utils'

describe('Open-Meteo response adapters', () => {
  it('normalizes geocoding results and keeps optional context optional', () => {
    const locations = parseGeocodingResponse(geocodingSuccessFixture)

    expect(locations).toHaveLength(2)
    expect(locations[0]).toMatchObject({
      id: 3117735,
      name: 'Madrid',
      admin1: 'Comunidad de Madrid',
      country: 'España',
    })
    expect(locations[1]).not.toHaveProperty('admin1')
  })

  it('normalizes a missing geocoding results property as an empty list', () => {
    expect(parseGeocodingResponse(geocodingEmptyFixture)).toEqual([])
  })

  it('rejects an invalid geocoding result', () => {
    expect(() => parseGeocodingResponse({ results: [{ name: 'Madrid' }] })).toThrow(
      InvalidOpenMeteoResponseError,
    )
  })

  it('normalizes current conditions and exactly seven aligned days', () => {
    const weather = parseForecastResponse(forecastSuccessFixture)

    expect(weather.current).toMatchObject({
      temperature: 24.3,
      condition: 'mainlyClear',
      isDay: true,
    })
    expect(weather.daily).toHaveLength(7)
    expect(weather.daily[0]).toEqual({
      date: '2026-08-23',
      maxTemperature: 31,
      minTemperature: 19,
      precipitationProbability: 5,
    })
  })

  it('keeps isolated missing values and unknown weather codes observable', () => {
    const weather = parseForecastResponse(forecastPartialFixture)

    expect(weather.current.apparentTemperature).toBeNull()
    expect(weather.current.condition).toBe('unknown')
    expect(weather.daily[1]?.precipitationProbability).toBeNull()
  })

  it('rejects incomplete or misaligned forecast structures', () => {
    expect(() => parseForecastResponse(forecastInvalidFixture)).toThrow(
      InvalidOpenMeteoResponseError,
    )
    expect(() => parseForecastResponse({ daily: {} })).toThrow(
      InvalidOpenMeteoResponseError,
    )
  })

  it('maps known and unknown WMO codes', () => {
    expect(getWeatherCondition(95)).toBe('thunderstorm')
    expect(getWeatherCondition(999)).toBe('unknown')
    expect(getWeatherCondition(null)).toBe('unknown')
  })

  it('formats a civil ISO date in Spanish without shifting the day', () => {
    expect(formatForecastDate('2026-08-23', 'es')).toMatch(/dom.*23.*ago/i)
    expect(formatForecastDate('2026-08-23', 'en')).toMatch(/sun.*aug.*23/i)
    expect(() => formatForecastDate('2026-02-30', 'es')).toThrow(
      InvalidOpenMeteoResponseError,
    )
  })
})

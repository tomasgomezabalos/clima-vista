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
    expect(() =>
      parseGeocodingResponse({
        results: [
          { id: 1, name: ' ', latitude: 40.4, longitude: -3.7 },
        ],
      }),
    ).toThrow(InvalidOpenMeteoResponseError)
    expect(() => parseGeocodingResponse({ results: null })).toThrow(
      InvalidOpenMeteoResponseError,
    )
  })

  it('omits absent optional geocoding context', () => {
    expect(
      parseGeocodingResponse({
        results: [{ id: 1, name: 'Madrid', latitude: 40.4, longitude: -3.7 }],
      }),
    ).toEqual([{ id: 1, name: 'Madrid', latitude: 40.4, longitude: -3.7 }])
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
    expect(() =>
      parseForecastResponse({
        ...forecastSuccessFixture,
        daily: {
          ...forecastSuccessFixture.daily,
          temperature_2m_max: forecastSuccessFixture.daily.temperature_2m_max.slice(
            0,
            6,
          ),
        },
      }),
    ).toThrow(InvalidOpenMeteoResponseError)
    expect(() =>
      parseForecastResponse({
        ...forecastSuccessFixture,
        current: { ...forecastSuccessFixture.current, is_day: 2 },
      }),
    ).toThrow(InvalidOpenMeteoResponseError)
  })

  it('normalizes missing, night and nullable forecast values', () => {
    const missingDaytime = parseForecastResponse({
      ...forecastSuccessFixture,
      current: { ...forecastSuccessFixture.current, is_day: undefined },
    })
    const night = parseForecastResponse({
      ...forecastSuccessFixture,
      current: { ...forecastSuccessFixture.current, is_day: 0 },
      daily: {
        ...forecastSuccessFixture.daily,
        temperature_2m_max: [null, 32, 33, 31, 29, 30, 31],
        temperature_2m_min: [null, 20, 21, 19, 18, 18, 19],
      },
    })

    expect(missingDaytime.current.isDay).toBeNull()
    expect(night.current.isDay).toBe(false)
    expect(night.daily[0]).toMatchObject({
      maxTemperature: null,
      minTemperature: null,
    })
  })

  it('maps known and unknown WMO codes', () => {
    expect(getWeatherCondition(95)).toBe('thunderstorm')
    expect(getWeatherCondition(999)).toBe('unknown')
    expect(getWeatherCondition(null)).toBe('unknown')
  })

  it('formats a civil ISO date in Spanish without shifting the day', () => {
    expect(formatForecastDate('2026-08-23', 'es')).toMatch(/dom.*23.*ago/i)
    expect(formatForecastDate('2026-08-23', 'en')).toMatch(/sun.*aug.*23/i)
    expect(formatForecastDate('2026-01-15', 'it')).toMatch(/gio.*15.*gen/i)
    expect(() => formatForecastDate('2026-02-30', 'es')).toThrow(
      InvalidOpenMeteoResponseError,
    )
    expect(() => formatForecastDate('23-08-2026', 'es')).toThrow(
      InvalidOpenMeteoResponseError,
    )
  })
})

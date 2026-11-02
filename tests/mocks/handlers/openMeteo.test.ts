import { describe, expect, it } from 'vitest'
import {
  forecastInvalidFixture,
  forecastPartialFixture,
  forecastSuccessFixture,
  geocodingEmptyFixture,
  geocodingEnglishSuccessFixture,
  geocodingInvalidWeatherFixture,
  geocodingItalianSuccessFixture,
  geocodingPartialFixture,
  geocodingSlowFixture,
  geocodingSuccessFixture,
  geocodingWeatherErrorFixture,
} from '../../../mocks/fixtures/openMeteo'

const searchLocations = (term: string, language = 'es') =>
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({
      name: term,
      language,
    })}`,
  )

const getForecast = (latitude: string) =>
  fetch(
    `https://api.open-meteo.com/v1/forecast?${new URLSearchParams({
      latitude,
      longitude: '0',
    })}`,
  )

describe('Open-Meteo geocoding handler', () => {
  it.each([
    ['Madrid', 'es', geocodingSuccessFixture],
    ['Madrid', 'en', geocodingEnglishSuccessFixture],
    ['Madrid', 'it', geocodingItalianSuccessFixture],
    ['Madrid', 'fr', geocodingSuccessFixture],
    ['sin resultados', 'es', geocodingEmptyFixture],
    ['datos parciales', 'es', geocodingPartialFixture],
    ['error meteo', 'es', geocodingWeatherErrorFixture],
    ['respuesta invalida', 'es', geocodingInvalidWeatherFixture],
  ] as const)(
    'answers "%s" in %s with its scenario fixture',
    async (term, language, fixture) => {
      const response = await searchLocations(term, language)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(fixture)
    },
  )

  it('matches the scenario terms regardless of letter case', async () => {
    const response = await searchLocations('SIN RESULTADOS')

    expect(await response.json()).toEqual(geocodingEmptyFixture)
  })

  it('simulates a geocoding HTTP error', async () => {
    const response = await searchLocations('error busqueda')

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ reason: 'Mock geocoding error' })
  })
})

describe('Open-Meteo forecast handler', () => {
  it.each([
    ['1', forecastPartialFixture],
    ['3', forecastInvalidFixture],
    ['40.4165', forecastSuccessFixture],
  ] as const)(
    'answers latitude %s with its scenario fixture',
    async (latitude, fixture) => {
      const response = await getForecast(latitude)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(fixture)
    },
  )

  it('simulates a forecast HTTP error for latitude 2', async () => {
    const response = await getForecast('2')

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ reason: 'Mock forecast error' })
  })
})

describe('Open-Meteo slow scenario', () => {
  it('delays both the search and the forecast by about 1.2 seconds', async () => {
    const startedAt = performance.now()

    const [search, forecast] = await Promise.all([
      searchLocations('carga lenta').then((response) => response.json()),
      getForecast('4').then((response) => response.json()),
    ])

    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(1_100)
    expect(search).toEqual(geocodingSlowFixture)
    expect(forecast).toEqual(forecastSuccessFixture)
  })
})

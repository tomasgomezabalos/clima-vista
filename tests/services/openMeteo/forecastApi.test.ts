import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { forecastSuccessFixture } from '../../../mocks/fixtures/openMeteo'
import { server } from '../../../mocks/server'
import { createAppStore } from '../../../src/app/store'
import { forecastApi } from '../../../src/services/openMeteo/forecastApi'

const requestForecast = async () => {
  const store = createAppStore()
  const request = store.dispatch(
    forecastApi.endpoints.getForecast.initiate({
      latitude: 40.4165,
      longitude: -3.70256,
    }),
  )

  try {
    return await request
  } finally {
    request.unsubscribe()
  }
}

describe('forecastApi', () => {
  it('returns the parsed forecast of a successful response', async () => {
    const result = await requestForecast()

    expect(result.isSuccess).toBe(true)
    expect(result.data?.current).toEqual({
      temperature: 24.3,
      apparentTemperature: 24.8,
      humidity: 42,
      windSpeed: 11.7,
      weatherCode: 1,
      condition: 'mainlyClear',
      isDay: true,
    })
    expect(result.data?.daily).toHaveLength(7)
    expect(result.data?.daily[0]).toEqual({
      date: '2026-08-23',
      maxTemperature: 31,
      minTemperature: 19,
      precipitationProbability: 5,
    })
  })

  it('requests the documented Open-Meteo parameters', async () => {
    let params: URLSearchParams | undefined
    server.use(
      http.get('https://api.open-meteo.com/v1/forecast', ({ request }) => {
        params = new URL(request.url).searchParams
        return HttpResponse.json(forecastSuccessFixture)
      }),
    )

    await requestForecast()

    expect(Object.fromEntries(params ?? [])).toEqual({
      latitude: '40.4165',
      longitude: '-3.70256',
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
      daily:
        'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timezone: 'auto',
      forecast_days: '7',
      timeformat: 'iso8601',
    })
  })

  it('preserves an Open-Meteo transport error', async () => {
    server.use(
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.json({ reason: 'Unavailable' }, { status: 503 }),
      ),
    )

    const result = await requestForecast()

    expect(result).toMatchObject({
      isError: true,
      error: {
        status: 503,
        data: { reason: 'Unavailable' },
      },
    })
  })

  it('exposes an invalid successful response as a custom error', async () => {
    const invalidResponse = { current: {}, daily: { time: ['2026-08-23'] } }
    server.use(
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.json(invalidResponse),
      ),
    )

    const result = await requestForecast()

    expect(result).toMatchObject({
      isError: true,
      error: {
        status: 'CUSTOM_ERROR',
        error: 'Invalid forecast response',
        data: invalidResponse,
      },
    })
  })
})

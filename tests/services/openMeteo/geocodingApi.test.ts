import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { geocodingSuccessFixture } from '../../../mocks/fixtures/openMeteo'
import { server } from '../../../mocks/server'
import { createAppStore } from '../../../src/app/store'
import { geocodingApi } from '../../../src/services/openMeteo/geocodingApi'

const searchMadrid = async () => {
  const store = createAppStore()
  const request = store.dispatch(
    geocodingApi.endpoints.searchLocations.initiate({
      term: 'Madrid',
      language: 'es',
    }),
  )

  try {
    return await request
  } finally {
    request.unsubscribe()
  }
}

describe('geocodingApi', () => {
  it('returns the parsed locations of a successful response', async () => {
    const result = await searchMadrid()

    expect(result.isSuccess).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(result.data?.[0]).toEqual({
      id: 3117735,
      name: 'Madrid',
      latitude: 40.4165,
      longitude: -3.70256,
      admin1: 'Comunidad de Madrid',
      country: 'España',
    })
  })

  it('requests the documented Open-Meteo parameters', async () => {
    let params: URLSearchParams | undefined
    server.use(
      http.get(
        'https://geocoding-api.open-meteo.com/v1/search',
        ({ request }) => {
          params = new URL(request.url).searchParams
          return HttpResponse.json(geocodingSuccessFixture)
        },
      ),
    )

    await searchMadrid()

    expect(Object.fromEntries(params ?? [])).toEqual({
      name: 'Madrid',
      language: 'es',
      format: 'json',
      count: '10',
    })
  })

  it('returns no locations when the search has no matches', async () => {
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json({}),
      ),
    )

    const result = await searchMadrid()

    expect(result.isSuccess).toBe(true)
    expect(result.data).toEqual([])
  })

  it('preserves an Open-Meteo transport error', async () => {
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json({ reason: 'Unavailable' }, { status: 503 }),
      ),
    )

    const result = await searchMadrid()

    expect(result).toMatchObject({
      isError: true,
      error: {
        status: 503,
        data: { reason: 'Unavailable' },
      },
    })
  })

  it('exposes an invalid successful response as a custom error', async () => {
    const invalidResponse = { results: null }
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(invalidResponse),
      ),
    )

    const result = await searchMadrid()

    expect(result).toMatchObject({
      isError: true,
      error: {
        status: 'CUSTOM_ERROR',
        error: 'Invalid geocoding response',
        data: invalidResponse,
      },
    })
  })
})

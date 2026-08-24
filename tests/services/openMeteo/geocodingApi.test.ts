import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../../../mocks/server'
import { createAppStore } from '../../../src/app/store'
import { geocodingApi } from '../../../src/services/openMeteo/geocodingApi'

describe('geocodingApi', () => {
  it('exposes an invalid successful response as a custom error', async () => {
    const invalidResponse = { results: null }
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(invalidResponse),
      ),
    )
    const store = createAppStore()
    const request = store.dispatch(
      geocodingApi.endpoints.searchLocations.initiate({
        term: 'Madrid',
        language: 'es',
      }),
    )

    const result = await request

    expect(result).toMatchObject({
      isError: true,
      error: {
        status: 'CUSTOM_ERROR',
        error: 'Invalid geocoding response',
        data: invalidResponse,
      },
    })
    request.unsubscribe()
  })
})

import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../../../mocks/server'
import { createAppStore } from '../../../src/app/store'
import { forecastApi } from '../../../src/services/openMeteo/forecastApi'

describe('forecastApi', () => {
  it('preserves an Open-Meteo transport error', async () => {
    server.use(
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.json({ reason: 'Unavailable' }, { status: 503 }),
      ),
    )
    const store = createAppStore()
    const request = store.dispatch(
      forecastApi.endpoints.getForecast.initiate({
        latitude: 40.4165,
        longitude: -3.70256,
      }),
    )

    const result = await request

    expect(result).toMatchObject({
      isError: true,
      error: {
        status: 503,
        data: { reason: 'Unavailable' },
      },
    })
    request.unsubscribe()
  })
})

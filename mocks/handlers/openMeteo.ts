import { delay, http, HttpResponse } from 'msw'
import {
  forecastInvalidFixture,
  forecastPartialFixture,
  forecastSuccessFixture,
  geocodingEmptyFixture,
  geocodingEnglishSuccessFixture,
  geocodingItalianSuccessFixture,
  geocodingInvalidWeatherFixture,
  geocodingPartialFixture,
  geocodingSlowFixture,
  geocodingSuccessFixture,
  geocodingWeatherErrorFixture,
} from '../fixtures/openMeteo'

const getGeocodingFixture = (language: string | null) => {
  if (language === 'en') {
    return geocodingEnglishSuccessFixture
  }

  if (language === 'it') {
    return geocodingItalianSuccessFixture
  }

  return geocodingSuccessFixture
}

export const openMeteoHandlers = [
  http.get('https://geocoding-api.open-meteo.com/v1/search', async ({ request }) => {
    const params = new URL(request.url).searchParams
    const term = params.get('name')?.toLocaleLowerCase()
    const language = params.get('language')

    if (term === 'sin resultados') {
      return HttpResponse.json(geocodingEmptyFixture)
    }

    if (term === 'error busqueda') {
      return HttpResponse.json({ reason: 'Mock geocoding error' }, { status: 503 })
    }

    if (term === 'datos parciales') {
      return HttpResponse.json(geocodingPartialFixture)
    }

    if (term === 'error meteo') {
      return HttpResponse.json(geocodingWeatherErrorFixture)
    }

    if (term === 'respuesta invalida') {
      return HttpResponse.json(geocodingInvalidWeatherFixture)
    }

    if (term === 'carga lenta') {
      await delay(1_200)
      return HttpResponse.json(geocodingSlowFixture)
    }

    return HttpResponse.json(getGeocodingFixture(language))
  }),
  http.get('https://api.open-meteo.com/v1/forecast', async ({ request }) => {
    const latitude = new URL(request.url).searchParams.get('latitude')

    if (latitude === '1') {
      return HttpResponse.json(forecastPartialFixture)
    }

    if (latitude === '2') {
      return HttpResponse.json({ reason: 'Mock forecast error' }, { status: 503 })
    }

    if (latitude === '3') {
      return HttpResponse.json(forecastInvalidFixture)
    }

    if (latitude === '4') {
      await delay(1_200)
    }

    return HttpResponse.json(forecastSuccessFixture)
  }),
]

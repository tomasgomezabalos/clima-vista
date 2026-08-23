import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, delay, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import {
  forecastInvalidFixture,
  forecastSuccessFixture,
  geocodingEmptyFixture,
  geocodingEnglishSuccessFixture,
  geocodingSuccessFixture,
} from '../../../mocks/fixtures/openMeteo'
import { server } from '../../../mocks/server'
import { createAppStore } from '../../../src/app/store'
import { Home } from '../../../src/pages/Home'

const renderHome = () =>
  render(
    <Provider store={createAppStore()}>
      <Home />
    </Provider>,
  )

const submitSearch = async (term: string) => {
  const user = userEvent.setup()
  const searchbox = screen.getByRole('searchbox', { name: 'Localidad' })
  await user.clear(searchbox)
  await user.type(searchbox, term)
  await user.click(screen.getByRole('button', { name: 'Buscar' }))
  return user
}

describe('Home', () => {
  it('shows the initial state and rejects a short term without a request', async () => {
    const geocodingRequest = vi.fn()
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
        geocodingRequest()
        return HttpResponse.json(geocodingSuccessFixture)
      }),
    )
    renderHome()

    expect(screen.getByRole('heading', { name: 'Clima Vista' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(document.documentElement).toHaveAttribute('lang', 'es')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Escribe una localidad para comenzar.',
    )

    await submitSearch(' M ')

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Introduce al menos dos caracteres.',
    )
    expect(geocodingRequest).not.toHaveBeenCalled()
    expect(screen.queryByText(/Tiempo actual en/)).not.toBeInTheDocument()
  })

  it('completes the search and seven-day weather flow with the approved parameters', async () => {
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', async ({ request }) => {
        const params = new URL(request.url).searchParams
        expect(params.get('name')).toBe('Madrid')
        expect(params.get('language')).toBe('es')
        expect(params.get('format')).toBe('json')
        expect(params.get('count')).toBe('10')
        await delay(40)
        return HttpResponse.json(geocodingSuccessFixture)
      }),
      http.get('https://api.open-meteo.com/v1/forecast', async ({ request }) => {
        const params = new URL(request.url).searchParams
        expect(params.get('latitude')).toBe('40.4165')
        expect(params.get('longitude')).toBe('-3.70256')
        expect(params.get('temperature_unit')).toBe('celsius')
        expect(params.get('wind_speed_unit')).toBe('kmh')
        expect(params.get('timezone')).toBe('auto')
        expect(params.get('forecast_days')).toBe('7')
        await delay(40)
        return HttpResponse.json(forecastSuccessFixture)
      }),
    )
    renderHome()

    const user = await submitSearch('  Madrid  ')
    expect(screen.getByRole('status')).toHaveTextContent('Buscando localidades…')

    const location = await screen.findByRole('button', {
      name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
    })
    expect(screen.getByRole('searchbox')).toHaveValue('Madrid')

    await user.click(location)
    expect(screen.getByRole('status')).toHaveTextContent(
      'Consultando la información meteorológica…',
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Tiempo actual en Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(9)
    expect(screen.getByText('24,3 °C')).toBeInTheDocument()
  })

  it('shows an empty state and allows a new search', async () => {
    let requestCount = 0
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
        requestCount += 1
        return HttpResponse.json(
          requestCount === 1 ? geocodingEmptyFixture : geocodingSuccessFixture,
        )
      }),
    )
    renderHome()

    await submitSearch('Atlantis')
    expect(
      await screen.findByText(/No hemos encontrado localidades/),
    ).toBeInTheDocument()

    await submitSearch('Madrid')
    expect(
      await screen.findByRole('button', {
        name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
  })

  it('shows recoverable errors for failed geocoding and invalid weather', async () => {
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(null, { status: 503 }),
      ),
    )
    renderHome()

    await submitSearch('Madrid')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se han podido consultar las localidades.',
    )

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(geocodingSuccessFixture),
      ),
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.json(forecastInvalidFixture),
      ),
    )

    const user = await submitSearch('Madrid')
    await user.click(
      await screen.findByRole('button', {
        name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se ha podido obtener la información meteorológica.',
    )
    expect(screen.queryByText(/Tiempo actual en/)).not.toBeInTheDocument()
  })

  it('removes previous weather as soon as a new search starts', async () => {
    renderHome()
    const user = await submitSearch('Madrid')
    await user.click(
      await screen.findByRole('button', {
        name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
      }),
    )
    expect(await screen.findByText('24,3 °C')).toBeInTheDocument()

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', async () => {
        await delay(60)
        return HttpResponse.json(geocodingEmptyFixture)
      }),
    )

    await submitSearch('Toledo')
    expect(screen.queryByText('24,3 °C')).not.toBeInTheDocument()
    expect(await screen.findByText(/No hemos encontrado localidades/)).toBeInTheDocument()
  })

  it('updates a visible validation and the document language dynamically', async () => {
    renderHome()

    const user = await submitSearch('M')
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Introduce al menos dos caracteres.',
    )

    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter at least two characters.',
    )
    expect(screen.getByRole('searchbox', { name: 'Location' })).toHaveValue('M')
    expect(document.documentElement).toHaveAttribute('lang', 'en')

    await user.click(screen.getByRole('button', { name: 'Español' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Introduce al menos dos caracteres.',
    )
    expect(document.documentElement).toHaveAttribute('lang', 'es')
  })

  it('preserves current weather and localizes only subsequent searches', async () => {
    const requestedLanguages: string[] = []
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }) => {
        const language = new URL(request.url).searchParams.get('language') ?? ''
        requestedLanguages.push(language)
        return HttpResponse.json(
          language === 'en'
            ? geocodingEnglishSuccessFixture
            : geocodingSuccessFixture,
        )
      }),
    )
    renderHome()

    const user = await submitSearch('Madrid')
    await user.click(
      await screen.findByRole('button', {
        name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
      }),
    )
    expect(await screen.findByText('24,3 °C')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(requestedLanguages).toEqual(['es'])
    expect(screen.getByRole('searchbox', { name: 'Location' })).toHaveValue(
      'Madrid',
    )
    expect(
      screen.getByRole('heading', {
        name: 'Current weather in Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('24.3 °C')).toBeInTheDocument()
    expect(screen.getAllByText('Mainly clear')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: /Sun.*Aug.*23/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'Searching for locations…',
    )
    expect(
      await screen.findByRole('button', {
        name: 'Check the weather in Madrid, Community of Madrid, Spain',
      }),
    ).toBeInTheDocument()
    expect(requestedLanguages).toEqual(['es', 'en'])
  })

  it('shows empty and recoverable error states in English', async () => {
    const user = userEvent.setup()
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(geocodingEmptyFixture),
      ),
    )
    renderHome()
    await user.click(screen.getByRole('button', { name: 'English' }))

    const searchbox = screen.getByRole('searchbox', { name: 'Location' })
    await user.type(searchbox, 'Atlantis')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(
      await screen.findByText("We couldn't find any locations. Try another search."),
    ).toBeInTheDocument()

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(null, { status: 503 }),
      ),
    )
    await user.clear(searchbox)
    await user.type(searchbox, 'Madrid')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "We couldn't search for locations.",
    )

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(geocodingEnglishSuccessFixture),
      ),
      http.get('https://api.open-meteo.com/v1/forecast', () =>
        HttpResponse.json(forecastInvalidFixture),
      ),
    )
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await user.click(
      await screen.findByRole('button', {
        name: 'Check the weather in Madrid, Community of Madrid, Spain',
      }),
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "We couldn't get the weather information.",
    )
  })
})

import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, delay, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import {
  forecastInvalidFixture,
  forecastSuccessFixture,
  geocodingEmptyFixture,
  geocodingEnglishSuccessFixture,
  geocodingItalianSuccessFixture,
  geocodingSuccessFixture,
} from '../../../mocks/fixtures/openMeteo'
import { server } from '../../../mocks/server'
import { createAppStore } from '../../../src/app/store'
import { AppLayout } from '../../../src/layouts/AppLayout'
import { Home } from '../../../src/pages/Home'

const renderHome = () =>
  render(
    <MemoryRouter>
      <Provider store={createAppStore()}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Provider>
    </MemoryRouter>,
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
    expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveValue('es')
    expect(document.documentElement).toHaveAttribute('lang', 'es')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Escribe una localidad para comenzar.',
    )

    const user = await submitSearch(' M ')

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Introduce al menos dos caracteres.',
    )
    expect(geocodingRequest).not.toHaveBeenCalled()
    expect(screen.queryByText(/Tiempo actual en/)).not.toBeInTheDocument()

    const searchbox = screen.getByRole('searchbox', { name: 'Localidad' })
    await user.clear(searchbox)
    await user.type(searchbox, 'Ma')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(geocodingRequest).not.toHaveBeenCalled()
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

    const languageSelector = screen.getByRole('combobox', { name: 'Idioma' })
    await user.selectOptions(languageSelector, 'en')

    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en')
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter at least two characters.',
    )
    expect(screen.getByRole('searchbox', { name: 'Location' })).toHaveValue('M')
    expect(document.documentElement).toHaveAttribute('lang', 'en')

    await user.selectOptions(languageSelector, 'it')

    expect(screen.getByRole('combobox', { name: 'Lingua' })).toHaveValue('it')
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Inserisci almeno due caratteri.',
    )
    expect(screen.getByRole('searchbox', { name: 'Località' })).toHaveValue('M')
    expect(document.documentElement).toHaveAttribute('lang', 'it')

    await user.selectOptions(languageSelector, 'es')

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Introduce al menos dos caracteres.',
    )
    expect(document.documentElement).toHaveAttribute('lang', 'es')
  })

  it('preserves current weather and localizes only subsequent searches', async () => {
    const requestedLanguages: string[] = []
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', async ({ request }) => {
        const language = new URL(request.url).searchParams.get('language') ?? ''
        requestedLanguages.push(language)
        if (language === 'en') {
          await delay(40)
        }
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

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Idioma' }),
      'en',
    )

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

  it('preserves weather when switching to Italian and localizes only a subsequent search', async () => {
    const requestedLanguages: string[] = []
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', async ({ request }) => {
        const language = new URL(request.url).searchParams.get('language') ?? ''
        requestedLanguages.push(language)
        if (language === 'it') {
          await delay(40)
        }
        return HttpResponse.json(
          language === 'it'
            ? geocodingItalianSuccessFixture
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

    const languageSelector = screen.getByRole('combobox', { name: 'Idioma' })
    languageSelector.focus()
    await user.selectOptions(languageSelector, 'it')

    expect(requestedLanguages).toEqual(['es'])
    expect(languageSelector).toHaveFocus()
    expect(languageSelector).toHaveValue('it')
    expect(screen.getByRole('searchbox', { name: 'Località' })).toHaveValue(
      'Madrid',
    )
    expect(
      screen.getByRole('heading', {
        name: 'Meteo attuale per Madrid, Comunidad de Madrid, España',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('24,3 °C')).toBeInTheDocument()
    expect(screen.getAllByText('Prevalentemente sereno')).toHaveLength(2)
    expect(
      screen.getByRole('heading', { name: /dom 23 ago/i }),
    ).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'it')

    await user.click(screen.getByRole('button', { name: 'Cerca' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'Ricerca delle località in corso…',
    )
    expect(
      await screen.findByRole('button', {
        name: 'Consulta il meteo per Madrid, Comunità di Madrid, Spagna',
      }),
    ).toBeInTheDocument()
    expect(requestedLanguages).toEqual(['es', 'it'])
  })

  it('shows initial, loading, empty and recoverable error states in Italian', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Idioma' }),
      'it',
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Inserisci una località per iniziare.',
    )

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', async () => {
        await delay(40)
        return HttpResponse.json(geocodingEmptyFixture)
      }),
    )
    const searchbox = screen.getByRole('searchbox', { name: 'Località' })
    await user.type(searchbox, 'Atlantis')
    await user.click(screen.getByRole('button', { name: 'Cerca' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'Ricerca delle località in corso…',
    )
    expect(
      await screen.findByText("Nessuna località trovata. Prova con un'altra ricerca."),
    ).toBeInTheDocument()

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(null, { status: 503 }),
      ),
    )
    await user.clear(searchbox)
    await user.type(searchbox, 'Madrid')
    await user.click(screen.getByRole('button', { name: 'Cerca' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Impossibile cercare le località.',
    )

    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(geocodingItalianSuccessFixture),
      ),
      http.get('https://api.open-meteo.com/v1/forecast', async () => {
        await delay(40)
        return HttpResponse.json(forecastInvalidFixture)
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Cerca' }))
    await user.click(
      await screen.findByRole('button', {
        name: 'Consulta il meteo per Madrid, Comunità di Madrid, Spagna',
      }),
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'Recupero delle informazioni meteo in corso…',
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Impossibile ottenere le informazioni meteo.',
    )
  })

  it('shows empty and recoverable error states in English', async () => {
    const user = userEvent.setup()
    server.use(
      http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
        HttpResponse.json(geocodingEmptyFixture),
      ),
    )
    renderHome()
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Idioma' }),
      'en',
    )

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

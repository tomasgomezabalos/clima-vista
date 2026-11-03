import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { server } from '../../../mocks/server'
import { App } from '../../../src/app/App'
import { createAppStore } from '../../../src/app/store'
import { expectNoAccessibilityViolations } from '../../setup/axe'

const renderApp = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Provider store={createAppStore()}>
        <App />
      </Provider>
    </MemoryRouter>,
  )

const search = async (term: string) => {
  const user = userEvent.setup()
  await user.type(
    await screen.findByRole('searchbox', { name: 'Localidad' }),
    term,
  )
  await user.click(screen.getByRole('button', { name: 'Buscar' }))
  return user
}

describe('App accessibility', () => {
  it.each([
    ['home', '/'],
    ['about', '/acerca-de'],
    ['an unknown route', '/ruta-desconocida'],
  ])('has no axe violations on %s', async (_name, route) => {
    renderApp(route)
    await screen.findByRole('heading', { level: 1 })

    await expectNoAccessibilityViolations()
  })

  describe('home states', () => {
    it('has no axe violations with a validation error', async () => {
      renderApp()
      await search('M')
      await screen.findByRole('alert')

      await expectNoAccessibilityViolations()
    })

    it('has no axe violations with search results', async () => {
      renderApp()
      await search('Madrid')
      await screen.findByRole('button', {
        name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
      })

      await expectNoAccessibilityViolations()
    })

    it('has no axe violations with the weather and forecast shown', async () => {
      renderApp()
      const user = await search('Madrid')
      await user.click(
        await screen.findByRole('button', {
          name: 'Consultar el tiempo de Madrid, Comunidad de Madrid, España',
        }),
      )
      await screen.findByRole('heading', {
        name: 'Tiempo actual en Madrid, Comunidad de Madrid, España',
      })

      await expectNoAccessibilityViolations()
    })

    it('has no axe violations with a search error', async () => {
      server.use(
        http.get('https://geocoding-api.open-meteo.com/v1/search', () =>
          HttpResponse.json(null, { status: 503 }),
        ),
      )
      renderApp()
      await search('Madrid')
      await screen.findByRole('alert')

      await expectNoAccessibilityViolations()
    })
  })
})

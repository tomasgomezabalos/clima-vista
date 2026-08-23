import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, useNavigate } from 'react-router'
import { App } from '../../../src/app/App'
import { createAppStore } from '../../../src/app/store'

const renderApp = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Provider store={createAppStore()}>
        <App />
      </Provider>
    </MemoryRouter>,
  )

const HistoryControls = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button type="button" onClick={() => void navigate(-1)}>
        Atrás
      </button>
      <button type="button" onClick={() => void navigate(1)}>
        Adelante
      </button>
    </div>
  )
}

const renderAppWithHistory = () =>
  render(
    <MemoryRouter>
      <Provider store={createAppStore()}>
        <App />
        <HistoryControls />
      </Provider>
    </MemoryRouter>,
  )

describe('App', () => {
  it('navigates between lazy pages and keeps the active language', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(
      await screen.findByRole('heading', { name: 'Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'El tiempo' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await user.click(screen.getByRole('link', { name: 'Acerca de' }))
    expect(
      await screen.findByRole('heading', { name: 'Acerca de Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Acerca de' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await user.click(screen.getByRole('button', { name: 'Italiano' }))
    expect(
      screen.getByRole('heading', { name: 'Informazioni su Clima Vista' }),
    ).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'it')

    await user.click(screen.getByRole('link', { name: 'Meteo' }))
    expect(
      await screen.findByRole('searchbox', { name: 'Località' }),
    ).toBeInTheDocument()
  })

  it('resets Home local state after leaving and returning', async () => {
    const user = userEvent.setup()
    renderApp()

    const searchbox = await screen.findByRole('searchbox', { name: 'Localidad' })
    await user.type(searchbox, 'Madrid')
    expect(searchbox).toHaveValue('Madrid')

    await user.click(screen.getByRole('link', { name: 'Acerca de' }))
    await screen.findByRole('heading', { name: 'Acerca de Clima Vista' })
    await user.click(screen.getByRole('link', { name: 'El tiempo' }))

    expect(
      await screen.findByRole('searchbox', { name: 'Localidad' }),
    ).toHaveValue('')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Escribe una localidad para comenzar.',
    )
  })

  it('renders a direct about route and recovers from an unknown route', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp('/acerca-de')

    expect(
      await screen.findByRole('heading', { name: 'Acerca de Clima Vista' }),
    ).toBeInTheDocument()
    unmount()

    renderApp('/ruta-desconocida')
    expect(
      await screen.findByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Volver al tiempo' }))
    expect(
      await screen.findByRole('heading', { name: 'Clima Vista' }),
    ).toBeInTheDocument()
  })

  it('follows backward and forward browser history entries', async () => {
    const user = userEvent.setup()
    renderAppWithHistory()

    await screen.findByRole('heading', { name: 'Clima Vista' })
    await user.click(screen.getByRole('link', { name: 'Acerca de' }))
    await screen.findByRole('heading', { name: 'Acerca de Clima Vista' })

    await user.click(screen.getByRole('button', { name: 'Atrás' }))
    expect(
      await screen.findByRole('heading', { name: 'Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'El tiempo' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await user.click(screen.getByRole('button', { name: 'Adelante' }))
    expect(
      await screen.findByRole('heading', { name: 'Acerca de Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Acerca de' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})

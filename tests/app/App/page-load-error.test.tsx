import { Provider } from 'react-redux'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { App } from '../../../src/app/App'
import { createAppStore } from '../../../src/app/store'

vi.mock('../../../src/pages/About', () => {
  throw new Error('chunk not found')
})

describe('App page load failure', () => {
  it('shows a recoverable message instead of a blank screen and keeps the header', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Provider store={createAppStore()}>
          <App />
        </Provider>
      </MemoryRouter>,
    )
    await screen.findByRole('heading', { name: 'Clima Vista' })

    await user.click(screen.getByRole('link', { name: 'Acerca de' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo cargar esta página',
    )
    expect(
      within(screen.getByRole('main')).getByRole('alert'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recargar' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Idioma' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'El tiempo' }))

    expect(
      await screen.findByRole('heading', { name: 'Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

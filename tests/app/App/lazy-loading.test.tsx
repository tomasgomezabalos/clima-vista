import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { createAppStore } from '../../../src/app/store'

const moduleLoads = vi.hoisted(() => ({
  about: vi.fn(),
  notFound: vi.fn(),
}))

vi.mock('../../../src/pages/About', () => {
  moduleLoads.about()

  return {
    About: () => (
      <main>
        <h1>About loaded on demand</h1>
      </main>
    ),
  }
})

vi.mock('../../../src/pages/NotFound', () => {
  moduleLoads.notFound()

  return {
    NotFound: () => (
      <main>
        <h1>Not found loaded on demand</h1>
      </main>
    ),
  }
})

describe('App lazy routes', () => {
  it('loads a route only when visited and reuses its resolved module', async () => {
    const { App } = await import('../../../src/app/App')
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Provider store={createAppStore()}>
          <App />
        </Provider>
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: 'Clima Vista' })
    expect(moduleLoads.about).not.toHaveBeenCalled()
    expect(moduleLoads.notFound).not.toHaveBeenCalled()

    await user.click(screen.getByRole('link', { name: 'Acerca de' }))
    expect(
      await screen.findByRole('heading', { name: 'About loaded on demand' }),
    ).toBeInTheDocument()
    expect(moduleLoads.about).toHaveBeenCalledTimes(1)
    expect(moduleLoads.notFound).not.toHaveBeenCalled()

    await user.click(screen.getByRole('link', { name: 'El tiempo' }))
    await screen.findByRole('heading', { name: 'Clima Vista' })
    await user.click(screen.getByRole('link', { name: 'Acerca de' }))

    expect(
      await screen.findByRole('heading', { name: 'About loaded on demand' }),
    ).toBeInTheDocument()
    expect(moduleLoads.about).toHaveBeenCalledTimes(1)
    expect(moduleLoads.notFound).not.toHaveBeenCalled()
  })
})

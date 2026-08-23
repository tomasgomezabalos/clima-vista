import { lazy } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AppLayout } from '../../../src/layouts/AppLayout'

const DeferredContent = () => (
  <main>
    <h1>Deferred content</h1>
  </main>
)

type DeferredModule = Readonly<{ default: typeof DeferredContent }>

let resolveDeferred: ((module: DeferredModule) => void) | undefined
const deferredModule = new Promise<DeferredModule>((resolve) => {
  resolveDeferred = resolve
})
const DeferredPage = lazy(() => deferredModule)

describe('AppLayout', () => {
  it('keeps navigation and language controls while route content loads', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DeferredPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Cargando página…')

    await user.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Loading page…')
    expect(document.documentElement).toHaveAttribute('lang', 'en')

    expect(resolveDeferred).toBeTypeOf('function')
    await act(async () => {
      resolveDeferred?.({ default: DeferredContent })
      await deferredModule
    })

    expect(
      await screen.findByRole('heading', { name: 'Deferred content' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})

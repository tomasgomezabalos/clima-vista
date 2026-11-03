import { lazy } from 'react'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import { routes } from '../../../src/app/routes'
import { AppLayout } from '../../../src/layouts/AppLayout'

const DeferredContent = () => (
  <div>
    <h1>Deferred content</h1>
  </div>
)

type DeferredModule = Readonly<{ default: typeof DeferredContent }>

let resolveDeferred: ((module: DeferredModule) => void) | undefined
const deferredModule = new Promise<DeferredModule>((resolve) => {
  resolveDeferred = resolve
})
const DeferredPage = lazy(() => deferredModule)

const NeverLoadedPage = lazy(
  () => new Promise<DeferredModule>(() => undefined),
)

const renderNavigableLayout = () =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DeferredContent />} />
          <Route path={routes.about} element={<DeferredContent />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('AppLayout', () => {
  it('holds the page loading state inside the single main region', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<NeverLoadedPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const regions = screen.getAllByRole('main')
    expect(regions).toHaveLength(1)
    expect(within(regions[0]).getByRole('status')).toHaveTextContent(
      'Cargando página…',
    )
  })

  it('moves focus to the main region after navigating, not on load or language change', async () => {
    const user = userEvent.setup()
    renderNavigableLayout()
    const main = screen.getByRole('main')

    expect(main).not.toHaveFocus()

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Idioma' }),
      'en',
    )
    expect(main).not.toHaveFocus()

    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(main).toHaveFocus()

    await user.click(screen.getByRole('link', { name: 'Weather' }))
    expect(main).toHaveFocus()
  })

  it('does not add the main region to the tab order', async () => {
    const user = userEvent.setup()
    renderNavigableLayout()

    const main = screen.getByRole('main')

    for (let step = 0; step < 6; step += 1) {
      await user.tab()
      expect(main).not.toHaveFocus()
    }

    for (let step = 0; step < 6; step += 1) {
      await user.tab({ shift: true })
      expect(main).not.toHaveFocus()
    }

    expect(main).toHaveAttribute('tabindex', '-1')
  })

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
    const languageSelector = screen.getByRole('combobox', { name: 'Idioma' })
    expect(screen.getByRole('status')).toHaveTextContent('Cargando página…')

    await user.selectOptions(languageSelector, 'en')
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en')
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

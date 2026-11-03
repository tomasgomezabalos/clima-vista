import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { i18n } from '../../../src/i18n/config'
import { NotFound } from '../../../src/pages/NotFound'

describe('NotFound', () => {
  it('explains the unknown route and links back home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Página no encontrada' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al tiempo' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it.each([
    ['en', 'Page not found', 'Back to the weather'],
    ['it', 'Pagina non trovata', 'Torna al meteo'],
  ] as const)('explains the unknown route in %s', async (language, title, link) => {
    await i18n.changeLanguage(language)
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: link })).toHaveAttribute('href', '/')
  })

  it.each([
    ['es', 'Página no encontrada · Clima Vista'],
    ['en', 'Page not found · Clima Vista'],
    ['it', 'Pagina non trovata · Clima Vista'],
  ] as const)('sets the document title in %s', async (language, title) => {
    await i18n.changeLanguage(language)
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(document.title).toBe(title)
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })
})

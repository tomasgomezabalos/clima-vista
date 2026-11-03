import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '../../../src/i18n/config'
import { About } from '../../../src/pages/About'

describe('About', () => {
  it('describes the existing Clima Vista capabilities', () => {
    render(<About />)

    expect(
      screen.getByRole('heading', { name: 'Acerca de Clima Vista' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/tiempo actual/)).toHaveTextContent(
      'previsión de los próximos siete días',
    )
  })

  it.each([
    ['en', 'About Clima Vista'],
    ['it', 'Informazioni su Clima Vista'],
  ] as const)('shows its title in %s', async (language, title) => {
    await i18n.changeLanguage(language)
    render(<About />)

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
  })

  it.each([
    ['es', 'Acerca de · Clima Vista'],
    ['en', 'About · Clima Vista'],
    ['it', 'Informazioni · Clima Vista'],
  ] as const)('sets the document title in %s', async (language, title) => {
    await i18n.changeLanguage(language)
    render(<About />)

    expect(document.title).toBe(title)
  })

  it('does not declare its own main region', () => {
    render(<About />)

    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })
})

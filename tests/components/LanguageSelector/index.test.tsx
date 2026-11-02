import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LanguageSelector } from '../../../src/components/LanguageSelector'
import { i18n } from '../../../src/i18n/config'

describe('LanguageSelector', () => {
  it('exposes the three languages as endonyms', () => {
    render(<LanguageSelector language="es" onLanguageChange={vi.fn()} />)

    expect(screen.getByRole('combobox', { name: 'Idioma' })).toHaveValue('es')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Español' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Italiano' })).toBeInTheDocument()
  })

  it('marks each option with its own language', () => {
    render(<LanguageSelector language="es" onLanguageChange={vi.fn()} />)

    expect(screen.getByRole('option', { name: 'Español' })).toHaveAttribute(
      'lang',
      'es',
    )
    expect(screen.getByRole('option', { name: 'English' })).toHaveAttribute(
      'lang',
      'en',
    )
    expect(screen.getByRole('option', { name: 'Italiano' })).toHaveAttribute(
      'lang',
      'it',
    )
  })

  it('notifies each selected language and keeps the focus on the control', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    render(
      <LanguageSelector language="es" onLanguageChange={onLanguageChange} />,
    )
    const selector = screen.getByRole('combobox', { name: 'Idioma' })

    selector.focus()
    await user.selectOptions(selector, 'en')
    expect(onLanguageChange).toHaveBeenLastCalledWith('en')
    expect(selector).toHaveFocus()

    await user.selectOptions(selector, 'it')
    expect(onLanguageChange).toHaveBeenLastCalledWith('it')
    expect(onLanguageChange).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['es', 'ES'],
    ['en', 'EN'],
    ['it', 'IT'],
  ] as const)('shows the %s code in the closed state', (language, code) => {
    render(<LanguageSelector language={language} onLanguageChange={vi.fn()} />)

    expect(screen.getByText(code)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue(language)
  })

  it.each([
    ['en', 'Language'],
    ['it', 'Lingua'],
  ] as const)(
    'translates the accessible name when the interface is in %s',
    async (language, name) => {
      await i18n.changeLanguage(language)
      render(<LanguageSelector language={language} onLanguageChange={vi.fn()} />)

      expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
    },
  )
})

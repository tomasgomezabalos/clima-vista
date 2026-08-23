import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LanguageSelector } from '../../../src/components/LanguageSelector'

describe('LanguageSelector', () => {
  it('exposes three endonyms and changes the active language natively', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    const { rerender } = render(
      <LanguageSelector
        language="es"
        onLanguageChange={onLanguageChange}
      />,
    )

    const selector = screen.getByRole('combobox', { name: 'Idioma' })
    expect(selector).toHaveValue('es')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Español' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Italiano' }),
    ).toBeInTheDocument()
    expect(screen.getByText('ES')).toBeInTheDocument()

    selector.focus()
    await user.selectOptions(selector, 'en')
    expect(onLanguageChange).toHaveBeenLastCalledWith('en')
    expect(selector).toHaveFocus()

    await user.selectOptions(selector, 'it')
    expect(onLanguageChange).toHaveBeenLastCalledWith('it')

    rerender(
      <LanguageSelector
        language="it"
        onLanguageChange={onLanguageChange}
      />,
    )
    expect(selector).toHaveValue('it')
    expect(screen.getByText('IT')).toBeInTheDocument()
    expect(selector).toHaveFocus()
  })
})

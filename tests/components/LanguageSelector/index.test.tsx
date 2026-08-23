import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LanguageSelector } from '../../../src/components/LanguageSelector'

describe('LanguageSelector', () => {
  it('exposes three endonyms, the active language and keyboard activation', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    const { rerender } = render(
      <LanguageSelector
        language="es"
        onLanguageChange={onLanguageChange}
      />,
    )

    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    const englishButton = screen.getByRole('button', { name: 'English' })
    expect(englishButton).toHaveAttribute('aria-pressed', 'false')
    const italianButton = screen.getByRole('button', { name: 'Italiano' })
    expect(italianButton).toHaveAttribute('aria-pressed', 'false')

    englishButton.focus()
    await user.keyboard('{Enter}')
    expect(onLanguageChange).toHaveBeenCalledWith('en')

    italianButton.focus()
    await user.keyboard(' ')
    expect(onLanguageChange).toHaveBeenCalledWith('it')

    rerender(
      <LanguageSelector
        language="it"
        onLanguageChange={onLanguageChange}
      />,
    )
    expect(englishButton).toHaveAttribute('aria-pressed', 'false')
    expect(italianButton).toHaveAttribute('aria-pressed', 'true')
    expect(italianButton).toHaveFocus()
  })
})

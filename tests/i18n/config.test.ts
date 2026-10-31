import { describe, expect, it } from 'vitest'
import { i18n } from '../../src/i18n/config'

describe('i18n document synchronization', () => {
  it('updates the document language when the active language changes', async () => {
    expect(i18n.resolvedLanguage).toBe('es')
    expect(document.documentElement).toHaveAttribute('lang', 'es')

    await i18n.changeLanguage('it')

    expect(i18n.resolvedLanguage).toBe('it')
    expect(document.documentElement).toHaveAttribute('lang', 'it')
  })
})

describe('i18n language persistence', () => {
  it('stores the language chosen by the user for the next visit', async () => {
    await i18n.changeLanguage('en')

    expect(localStorage.getItem('clima-vista.language')).toBe('en')
  })
})

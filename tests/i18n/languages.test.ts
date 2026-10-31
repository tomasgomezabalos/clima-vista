import { describe, expect, it } from 'vitest'
import {
  createLanguageRecord,
  defaultLanguage,
  formatLocaleByLanguage,
  resolveSupportedLanguage,
  supportedLanguages,
} from '../../src/i18n/languages'

describe('supported languages', () => {
  it('keeps Spanish as the safe default and supports Spanish, English and Italian', () => {
    expect(defaultLanguage).toBe('es')
    expect(supportedLanguages).toEqual(['es', 'en', 'it'])
    expect(resolveSupportedLanguage('en')).toBe('en')
    expect(resolveSupportedLanguage('en-US')).toBe('en')
    expect(resolveSupportedLanguage('it')).toBe('it')
    expect(resolveSupportedLanguage('it-IT')).toBe('it')
    expect(resolveSupportedLanguage('es-ES')).toBe('es')
    expect(resolveSupportedLanguage('fr')).toBe('es')
    expect(resolveSupportedLanguage(undefined)).toBe('es')
    expect(formatLocaleByLanguage).toEqual({
      es: 'es',
      en: 'en',
      it: 'it-IT',
    })
  })
})

describe('createLanguageRecord', () => {
  it('creates one value per supported language from its format locale', () => {
    const record = createLanguageRecord((locale) => `locale:${locale}`)

    expect(record).toEqual({
      es: 'locale:es',
      en: 'locale:en',
      it: 'locale:it-IT',
    })
  })
})

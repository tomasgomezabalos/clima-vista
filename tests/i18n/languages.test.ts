import { describe, expect, it } from 'vitest'
import {
  defaultLanguage,
  resolveSupportedLanguage,
  supportedLanguages,
} from '../../src/i18n/languages'

describe('supported languages', () => {
  it('keeps Spanish as the safe default and supports only Spanish and English', () => {
    expect(defaultLanguage).toBe('es')
    expect(supportedLanguages).toEqual(['es', 'en'])
    expect(resolveSupportedLanguage('en')).toBe('en')
    expect(resolveSupportedLanguage('en-US')).toBe('en')
    expect(resolveSupportedLanguage('es-ES')).toBe('es')
    expect(resolveSupportedLanguage('fr')).toBe('es')
    expect(resolveSupportedLanguage(undefined)).toBe('es')
  })
})

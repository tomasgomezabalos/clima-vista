import { describe, expect, it } from 'vitest'
import {
  detectInitialLanguage,
  getLanguageStorage,
  languageStorageKey,
  readStoredLanguage,
  storeLanguage,
} from '../../src/i18n/initialLanguage'

const createStorage = (initial: Record<string, string> = {}) => {
  const values = new Map(Object.entries(initial))

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
  }
}

const failingStorage = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
}

describe('readStoredLanguage', () => {
  it('returns a stored supported language', () => {
    const storage = createStorage({ [languageStorageKey]: 'it' })

    expect(readStoredLanguage(storage)).toBe('it')
  })

  it('ignores missing and unsupported values', () => {
    expect(readStoredLanguage(createStorage())).toBeNull()
    expect(
      readStoredLanguage(createStorage({ [languageStorageKey]: 'fr' })),
    ).toBeNull()
  })

  it('returns null when storage throws', () => {
    expect(readStoredLanguage(failingStorage)).toBeNull()
  })
})

describe('storeLanguage', () => {
  it('stores the language under the documented key', () => {
    const storage = createStorage()

    storeLanguage(storage, 'en')

    expect(storage.getItem(languageStorageKey)).toBe('en')
  })

  it('does not throw when storage is unavailable', () => {
    expect(() => storeLanguage(failingStorage, 'en')).not.toThrow()
  })
})

describe('detectInitialLanguage', () => {
  it('prefers the stored language over the browser languages', () => {
    const storage = createStorage({ [languageStorageKey]: 'en' })

    expect(detectInitialLanguage(storage, ['it-IT'])).toBe('en')
  })

  it('uses the first supported browser language when nothing is stored', () => {
    expect(detectInitialLanguage(createStorage(), ['fr-FR', 'IT-it', 'en'])).toBe(
      'it',
    )
  })

  it('falls back to Spanish when no preference is supported', () => {
    expect(detectInitialLanguage(createStorage(), ['fr', 'de-DE'])).toBe('es')
    expect(detectInitialLanguage(createStorage(), [])).toBe('es')
  })

  it('still detects the browser language when storage throws', () => {
    expect(detectInitialLanguage(failingStorage, ['en-US'])).toBe('en')
  })
})

describe('getLanguageStorage', () => {
  it('returns the browser storage when it is available', () => {
    expect(getLanguageStorage()).toBe(localStorage)
  })

  it('returns an inert storage when accessing localStorage throws', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        throw new Error('SecurityError')
      },
    })

    try {
      const storage = getLanguageStorage()

      expect(storage.getItem(languageStorageKey)).toBeNull()
      expect(() => storage.setItem(languageStorageKey, 'en')).not.toThrow()
    } finally {
      Object.defineProperty(globalThis, 'localStorage', descriptor!)
    }
  })
})

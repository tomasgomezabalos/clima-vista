import {
  defaultLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from './languages'

export const languageStorageKey = 'clima-vista.language'

type LanguageStorage = Pick<Storage, 'getItem' | 'setItem'>

const unavailableStorage: LanguageStorage = {
  getItem: () => null,
  setItem: () => undefined,
}

// Reading `localStorage` itself can throw when site data is blocked.
export const getLanguageStorage = (): LanguageStorage => {
  try {
    return globalThis.localStorage
  } catch {
    return unavailableStorage
  }
}

const isSupportedLanguage = (
  value: string | null,
): value is SupportedLanguage =>
  supportedLanguages.some((language) => language === value)

export const readStoredLanguage = (
  storage: LanguageStorage,
): SupportedLanguage | null => {
  try {
    const stored = storage.getItem(languageStorageKey)

    return isSupportedLanguage(stored) ? stored : null
  } catch {
    return null
  }
}

export const storeLanguage = (
  storage: LanguageStorage,
  language: SupportedLanguage,
): void => {
  try {
    storage.setItem(languageStorageKey, language)
  } catch {
    // Persistence is a convenience: the app keeps working without it.
  }
}

export const detectInitialLanguage = (
  storage: LanguageStorage,
  preferredLanguages: readonly string[],
): SupportedLanguage => {
  const stored = readStoredLanguage(storage)

  if (stored) {
    return stored
  }

  for (const preferred of preferredLanguages) {
    const base = preferred.split('-')[0].toLowerCase()
    const match = supportedLanguages.find((language) => language === base)

    if (match) {
      return match
    }
  }

  return defaultLanguage
}

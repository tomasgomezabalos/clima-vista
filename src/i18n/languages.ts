export const supportedLanguages = ['es', 'en', 'it'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const defaultLanguage: SupportedLanguage = 'es'

export const formatLocaleByLanguage = {
  es: 'es',
  en: 'en',
  it: 'it-IT',
} as const satisfies Readonly<Record<SupportedLanguage, string>>

export const resolveSupportedLanguage = (
  language: string | undefined,
): SupportedLanguage => {
  const baseLanguage = language?.split('-')[0]

  return (
    supportedLanguages.find((supported) => supported === baseLanguage) ??
    defaultLanguage
  )
}

export const createLanguageRecord = <T>(
  create: (locale: string) => T,
): Readonly<Record<SupportedLanguage, T>> => ({
  es: create(formatLocaleByLanguage.es),
  en: create(formatLocaleByLanguage.en),
  it: create(formatLocaleByLanguage.it),
})

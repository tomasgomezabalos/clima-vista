export const supportedLanguages = ['es', 'en'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const defaultLanguage: SupportedLanguage = 'es'

export const resolveSupportedLanguage = (
  language: string | undefined,
): SupportedLanguage => (language?.split('-')[0] === 'en' ? 'en' : 'es')

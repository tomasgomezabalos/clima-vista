import type { SupportedLanguage } from '../../../i18n/languages'

export type LanguageSelectorProps = Readonly<{
  language: SupportedLanguage
  onLanguageChange: (language: SupportedLanguage) => void
}>
